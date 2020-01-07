import * as vscode from 'vscode';
import * as path from 'path';

import { VersionProvider } from '../../virtual-documents/version-provider';
import { MergeResultProvider } from '../../virtual-documents/merge-result-provider';
import { ILine, IMergeResultLine, IChangesLine } from '../../model/line';
import { StateManager } from '../state-manager';
import {
  getLastLineContent,
  getFstLineContent,
  insertLine,
  shouldAddWasAddedToPaddingLines,
} from './typing-into-merge-result-helper';

export const open = async (fsPath: string) => {
  const { name, ext } = path.parse(fsPath);
  const localChanges = await openLocalChanges(name, ext);
  const mergeResult = await openMergeResult(name, ext);
  const remoteChanges = await openRemoteChanges(name, ext);

  return { localChanges, mergeResult, remoteChanges };
};

export const close = (editors: vscode.TextEditor[]) =>
  Promise.all(editors.map(editor => editor.hide()));

const openLocalChanges = async (name: string, ext: string) => {
  const uri = `${VersionProvider.scheme}:${name} (LOCAL)${ext}?${VersionProvider.types.localChanges}`;
  const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(uri));
  return vscode.window.showTextDocument(document, {
    preview: false,
    preserveFocus: true,
  });
};

const openMergeResult = async (name: string, ext: string) => {
  const uri = `${MergeResultProvider.scheme}:/${name} (Merge Result)${ext}`;
  const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(uri));
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

const openRemoteChanges = async (name: string, ext: string) => {
  const uri = `${VersionProvider.scheme}:${name} (REMOTE)${ext}?${VersionProvider.types.remoteChanges}`;
  const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(uri));
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

export const linesToText = (lines: ILine[]) => lines.map(l => l.content).join('\n');

export const updateMergeResultContent = (
  event: vscode.TextDocumentContentChangeEvent,
  mrLines: IMergeResultLine[],
  localLines: IChangesLine[],
  remoteLines: IChangesLine[]
) => {
  const startLine = event.range.start.line;
  const startChar = event.range.start.character;
  const endLine = event.range.end.line;
  const endChar = event.range.end.character;
  const newLines = event.text.split('\n');

  // console.log('hieeer');
  // console.log(startLine, startChar);
  // console.log(endLine, endChar);
  // console.log(event.text);
  // console.log('hier end');

  const addWasAddedToLocal = shouldAddWasAddedToPaddingLines(
    mrLines,
    localLines,
    endLine,
    endChar
  );
  const addWasAddedToRemote = shouldAddWasAddedToPaddingLines(
    mrLines,
    remoteLines,
    endLine,
    endChar
  );

  const lastLineContent = getLastLineContent(mrLines, newLines, endLine, endChar);
  mrLines[startLine].content =
    getFstLineContent(mrLines, newLines, startLine, startChar, endLine, endChar); // prettier-ignore

  if (newLines.length > 1) {
    let i = 1; // first line with offset 0 was already updated before
    const insertLineFunction = (content: string) =>
      insertLine(mrLines,startLine + i,content,localLines,addWasAddedToLocal,remoteLines,addWasAddedToRemote); // prettier-ignore

    for (i; i < newLines.length - 1 && i < endLine - startLine; i++)
      mrLines[startLine + i].content = newLines[i];
    for (i; i < newLines.length - 1 && i < newLines.length; i++)
      insertLineFunction(newLines[i]);

    if (startLine + i <= endLine) mrLines[endLine].content = lastLineContent;
    else insertLineFunction(lastLineContent);
  }

  let paddingStart = startLine + newLines.length;
  const paddingEnd = endChar === 0 ? endLine : endLine + 1;
  for (paddingStart; paddingStart < paddingEnd; paddingStart++) {
    mrLines[startLine + paddingStart].content = '';
    mrLines[startLine + paddingStart].isAlignmentPadding = true;
  }

  StateManager.applyDecorations(); // todo remove
  MergeResultProvider.fireUpdateContent();
  // also local and remote versions have changed!
};

import * as vscode from 'vscode';
import * as path from 'path';

import { VersionProvider } from '../../virtual-documents/version-provider';
import { MergeResultProvider } from '../../virtual-documents/merge-result-provider';
import { ILine, IMergeResultLine } from '../../model/line';
import {
  getLastLineContent,
  getFstLineContent,
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
  mrLines: IMergeResultLine[]
) => {
  const startLine = event.range.start.line;
  const startChar = event.range.start.character;
  const endLine = event.range.end.line;
  const endChar = event.range.end.character;
  const newLines = event.text.split('\n');

  const lastLineContent = getLastLineContent(mrLines, newLines, endLine, endChar);
  mrLines[startLine].content =
    getFstLineContent(mrLines, newLines, startLine, startChar, endLine, endChar); // prettier-ignore

  if (newLines.length > 1) {
    let i = 1; // first line already dealt with before
    for (i; i < newLines.length - 1 && i < endLine - startLine; i++)
      mrLines[startLine + i].content = newLines[i]; // replace the content of existing replaced lines
    for (i; i < newLines.length - 1 && i < newLines.length; i++)
      mrLines.splice(startLine + i, 0, { content: newLines[i] }); // insert new lines if necessary

    if (startLine + i <= endLine) mrLines[endLine].content = lastLineContent;
    else mrLines.splice(startLine + i, 0, { content: lastLineContent });
  }

  // todo test it
  // remove lines if endLine - startLine + 1 > newLines.length  / make them to padding
  for (let i = newLines.length; i < endLine - startLine; i++) {
    mrLines[startLine + i].content = '';
    mrLines[startLine + i].isAlignmentPadding = true;
  }

  // StateManager.applyDecorations
};

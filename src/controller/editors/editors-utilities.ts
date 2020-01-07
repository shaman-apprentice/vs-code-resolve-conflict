import * as vscode from 'vscode';
import * as path from 'path';

import { VersionProvider } from '../../virtual-documents/version-provider';
import { MergeResultProvider } from '../../virtual-documents/merge-result-provider';
import { ILine, IMergeResultLine } from '../../model/line';

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

export const updateMergeResult = (
  event: vscode.TextDocumentContentChangeEvent,
  lines: IMergeResultLine[]
) => {
  const startLine = event.range.start.line;
  const startChar = event.range.start.character;
  const endLine = event.range.end.line;
  const endChar = event.range.end.character;
  const newLines = event.text.split('\n');

  lines[startLine].content = replaceSubStr(
    lines[startLine].content,
    startChar,
    endLine - startLine === 0 ? endChar : lines[startLine].content.length,
    newLines[0]
  );

  // if endLine - startLine + 1 > newLines.length insert padding into mr

  for (let i = 1; i < newLines.length; i++) {
    // insert new lines into mr
    // update local / remote padding lines - and conflicts / decorations
  }
};

export const replaceSubStr = (
  s: string,
  start: number,
  end: number,
  replacement: string
) => s.slice(0, start) + replacement + s.slice(end);

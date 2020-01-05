import * as vscode from 'vscode';
import * as path from 'path';

import { VersionProvider } from '../../virtual-documents/version-provider';
import { MergeResultProvider } from '../../virtual-documents/merge-result-provider';
import { ILine } from '../../model/line';

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

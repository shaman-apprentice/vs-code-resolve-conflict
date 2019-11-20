import * as vscode from 'vscode';

import { LOCAL_CHANGES_SCHEME } from '../virtual-documents/local-changes';
import { MERGE_RESULT_SCHEME } from '../virtual-documents/merge-result';
import { REMOTE_CHANGES_SCHEME } from '../virtual-documents/remote-changes';

export const open = async () => {
  const localChanges = await openLocalChanges();
  const mergeResult = await openMergeResult();
  const serverChanges = await openServerChanges();
  return { localChanges, mergeResult, serverChanges };
};

export const close = async (editors: vscode.TextEditor[]) => {
  await Promise.all(editors.map(editor => editor.hide()));
};

const openLocalChanges = async () => {
  const uri = vscode.Uri.parse(LOCAL_CHANGES_SCHEME + ':Local changes (read only)');
  const document = await vscode.workspace.openTextDocument(uri);
  return vscode.window.showTextDocument(document, {
    preview: false,
    preserveFocus: true,
    // viewColumn: vscode.ViewColumn.Beside,
  });
};

const openMergeResult = async () => {
  const uri = vscode.Uri.parse(MERGE_RESULT_SCHEME + ':Merge Result');
  const document = await vscode.workspace.openTextDocument(uri);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

const openServerChanges = async () => {
  const uri = vscode.Uri.parse(
    REMOTE_CHANGES_SCHEME + ':Remote Changes (read only)'
  );
  const document = await vscode.workspace.openTextDocument(uri);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

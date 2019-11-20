import * as vscode from 'vscode';

import { LOCAL_CHANGES_SCHEME } from '../virtual-documents/local-changes';
import { MERGE_RESULT_SCHEME } from '../virtual-documents/merge-result';
import { REMOTE_CHANGES_SCHEME } from '../virtual-documents/remote-changes';

export const open = async () => {
  const localChangesEditor = await openLocalChangesEditor();
  const mergeResultEditor = await openMergeResultEditor();
  const serverChangesEditor = await openServerChangesEditor();
  return { localChangesEditor, mergeResultEditor, serverChangesEditor };
};

const openLocalChangesEditor = async () => {
  const uri = vscode.Uri.parse(LOCAL_CHANGES_SCHEME + ':Local changes (read only)');
  const document = await vscode.workspace.openTextDocument(uri);
  return vscode.window.showTextDocument(document, {
    preview: false,
    preserveFocus: true,
    // viewColumn: vscode.ViewColumn.Beside,
  });
};

const openMergeResultEditor = async () => {
  const uri = vscode.Uri.parse(MERGE_RESULT_SCHEME + ':Merge Result');
  const document = await vscode.workspace.openTextDocument(uri);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

const openServerChangesEditor = async () => {
  const uri = vscode.Uri.parse(
    REMOTE_CHANGES_SCHEME + ':Remote Changes (read only)'
  );
  const document = await vscode.workspace.openTextDocument(uri);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

import * as vscode from 'vscode';

import { SCHEMA, PATHS } from '../../virtual-documents/resolve-conflict';

export const open = async () => {
  const localChanges = await openLocalChanges();
  const mergeResult = await openMergeResult();
  const remoteChanges = await openRemoteChanges();
  return { localChanges, mergeResult, remoteChanges };
};

export const close = (editors: vscode.TextEditor[]) => {
  return Promise.all(editors.map(editor => editor.hide()));
};

const openLocalChanges = async () => {
  const document = await getDocument(PATHS.localChanges);
  return vscode.window.showTextDocument(document, {
    preview: false,
    preserveFocus: true,
  });
};

const openMergeResult = async () => {
  const document = await getDocument(PATHS.mergeResult);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

const openRemoteChanges = async () => {
  const document = await getDocument(PATHS.remoteChanges);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

const getDocument = (path: string) => {
  const uri = vscode.Uri.parse(`${SCHEMA}:${path}`);
  return vscode.workspace.openTextDocument(uri);
};

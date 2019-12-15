import * as vscode from 'vscode';
import * as path from 'path';

import { SCHEMA, types } from '../../virtual-documents/resolve-conflict';

export const open = async (fsPath: string) => {
  const { name, ext } = path.parse(fsPath);

  const localChanges = await openLocalChanges(
    `${name} (LOCAL)${ext}?${types.local}`
  );
  const mergeResult = await openMergeResult(
    `${name} (Merge Result)${ext}?${types.result}`
  );
  const remoteChanges = await openRemoteChanges(
    `${name} (REMOTE)${ext}?${types.remote}`
  );

  return { localChanges, mergeResult, remoteChanges };
};

export const close = (editors: vscode.TextEditor[]) => {
  return Promise.all(editors.map(editor => editor.hide()));
};

const openLocalChanges = async (path: string) => {
  const document = await getDocument(path);
  return vscode.window.showTextDocument(document, {
    preview: false,
    preserveFocus: true,
  });
};

const openMergeResult = async (path: string) => {
  const document = await getDocument(path);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

const openRemoteChanges = async (path: string) => {
  const document = await getDocument(path);
  return vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

const getDocument = (path: string) => {
  const uri = vscode.Uri.parse(`${SCHEMA}:${path}`);
  return vscode.workspace.openTextDocument(uri);
};

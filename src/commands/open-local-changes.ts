import * as vscode from 'vscode';

import { LOCAL_CHANGES_SCHEME } from '../virtual-documents/local-changes';

export const openLocalChanges = async () => {
  const uri = vscode.Uri.parse(LOCAL_CHANGES_SCHEME + ':Local changes - read only');
  const document = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(document, {
    preview: false,
    preserveFocus: true,
    viewColumn: vscode.ViewColumn.Beside,
  });
};

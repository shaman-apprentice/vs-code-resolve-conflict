import * as vscode from 'vscode';
import { getView } from '../controller/resolve-conflict-web-view';

import { StateManager } from '../controller/state-manager';

export const openResolveConflict = (extCtx: vscode.ExtensionContext) => async (
  cmdCtx: any
) => {
  const fsPath = getFsPath(cmdCtx);
  if (!fsPath) return;

  //StateManager.init(fsPath);
  const webViewPanel = getView(extCtx);
};

const getFsPath = (ctx: any) => {
  if (ctx) return ctx.resourceUri.fsPath;

  if (vscode.window.activeTextEditor)
    return vscode.window.activeTextEditor.document.fileName;

  return null;
};

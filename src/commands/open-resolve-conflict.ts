import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';

export const openResolveConflict = (ctx: any) => {
  const fsPath = getFsPath(ctx);
  if (!fsPath) return;

  return StateManager.init(fsPath);
};

const getFsPath = (ctx?: any) => {
  if (ctx) return ctx.resourceUri.fsPath;

  if (vscode.window.activeTextEditor)
    return vscode.window.activeTextEditor.document.fileName;

  return null;
};

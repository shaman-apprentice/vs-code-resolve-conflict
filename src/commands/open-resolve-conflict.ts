import * as vscode from 'vscode';

import { StateManager } from '../utilities/state-manager';

export const openResolveConflict = async (ctx: any) => {
  const fsPath = getFsPath(ctx);
  if (!fsPath) return;

  await StateManager.init(fsPath);
  StateManager.applyDecorations();
};

const getFsPath = (ctx?: any) => {
  if (ctx) return ctx.resourceUri.fsPath;

  if (vscode.window.activeTextEditor)
    // todo check if it has conflicts somewhere - else skip
    return vscode.window.activeTextEditor.document.fileName;

  return null;
};

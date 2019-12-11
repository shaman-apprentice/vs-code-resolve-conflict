import * as vscode from 'vscode';

import { removed as removedDecorationType } from '../text-editor-decoration/removed';
import { getHover } from '../text-editor-decoration/hover';
import { StateManager } from '../utilities/state-manager';

export const openResolveConflict = async (ctx: any) => {
  if (!ctx || !ctx.resourceUri || !ctx.resourceUri.fsPath) return;

  await StateManager.init(ctx.resourceUri.fsPath);
  StateManager.applyDecorations();
};

import * as vscode from 'vscode';

import { removed as removedDecorationType } from '../text-editor-decoration/removed';
import { getHover } from '../text-editor-decoration/hover';
import { initConflictData } from '../conflict-data-manager';
import { open as openEditors } from './editors';

export const openResolveConflict = async (ctx: any) => {
  if (!ctx || !ctx.resourceUri || !ctx.resourceUri.fsPath) return;

  const conflictData = initConflictData(ctx.resourceUri.fsPath);
  await openEditors();

  // const editor = vscode.window.activeTextEditor;
  // if (!editor) return;

  // editor.setDecorations(removedDecorationType, [
  //   {
  //     range: new vscode.Range(new vscode.Position(2, 0), new vscode.Position(3, 0)),
  //     hoverMessage: [getHover(), 'hi 2'],
  //   },
  // ]);
};

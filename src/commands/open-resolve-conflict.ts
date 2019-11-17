import * as vscode from 'vscode';
import { promises as fs } from 'fs';

import { removed as removedDecorationType } from '../text-editor-decoration/removed';
import { getHover } from '../text-editor-decoration/hover';

export const openResolveConflict = async (ctx: any) => {
  if (!ctx || !ctx.resourceUri || !ctx.resourceUri.fsPath) return;

  const content = await fs.readFile(ctx.resourceUri.fsPath, {
    encoding: 'utf-8',
  });
  console.log(content);

  if (!ctx || !ctx.resourceUri || !ctx.resourceUri.path) return;
  console.log(ctx.resourceUri.path);

  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  editor.setDecorations(removedDecorationType, [
    {
      range: new vscode.Range(new vscode.Position(2, 0), new vscode.Position(3, 0)),
      hoverMessage: [getHover(), 'hi 2'],
    },
  ]);
};

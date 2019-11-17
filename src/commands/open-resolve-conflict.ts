import * as vscode from 'vscode';

import { removed as removedDecorationType } from '../text-editor-decoration/removed';
import { getHover } from '../text-editor-decoration/hover';

export const openResolveConflict = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  editor.setDecorations(removedDecorationType, [
    {
      range: new vscode.Range(new vscode.Position(2, 0), new vscode.Position(3, 0)),
      hoverMessage: [getHover(), 'hi 2'],
    },
  ]);
};

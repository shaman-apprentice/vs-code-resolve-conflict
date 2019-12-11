import * as vscode from 'vscode';

export const added = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'green',
  border: '2px solid darkgreen',
  isWholeLine: true,
});

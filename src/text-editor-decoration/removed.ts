import * as vscode from 'vscode';

export const removed = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'orange',
  border: '2px solid red',
  isWholeLine: true,
});

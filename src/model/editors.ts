import * as vscode from 'vscode';

export interface IEditors {
  localChanges: vscode.TextEditor;
  mergeResult: vscode.TextEditor;
  remoteChanges: vscode.TextEditor;
}

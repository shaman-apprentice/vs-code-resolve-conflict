import * as vscode from 'vscode';

import { IChangesLine, IMergeResultLine } from './line';

export interface IEditors {
  localChanges: IChangesEditor;
  mergeResult: IMergeResultEditor;
  remoteChanges: IChangesEditor;
}

interface IChangesEditor {
  editor: vscode.TextEditor;
  lines: IChangesLine[];
  addedDecorations: vscode.DecorationOptions[];
}

interface IMergeResultEditor {
  editor: vscode.TextEditor;
  lines: IMergeResultLine[];
  removedDecorations: vscode.DecorationOptions[];
}

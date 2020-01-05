import * as vscode from 'vscode';

export interface IEditors {
  localChanges: IGitChangesEditor;
  mergeResult: IMergeResultEditor;
  remoteChanges: IGitChangesEditor;
}

interface IGitChangesEditor {
  editor: vscode.TextEditor;
  lines: IChangesLine[];
  addedDecorations: vscode.DecorationOptions[];
}

interface IMergeResultEditor {
  editor: vscode.TextEditor;
  lines: IMergeResultLine[];
  removedDecorations: vscode.DecorationOptions[];
}

export interface IMergeResultLine extends ILine {
  wasManualAdded?: boolean;
  wasRemovedLocal?: boolean;
  wasRemovedRemote?: boolean;
}

export interface IChangesLine extends ILine {
  wasAdded?: boolean;
}

interface ILine {
  content: string;
  isAlignmentPadding?: boolean;
}

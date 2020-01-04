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

export interface IChangesLine {
  content: string;
  wasAdded: boolean;
}

interface IMergeResultEditor {
  editor: vscode.TextEditor;
  lines: IMergeResultLine[];
  removedDecorations: vscode.DecorationOptions[];
}

export interface IMergeResultLine {
  content: string;
  isLocalLine: boolean;
  isRemoteLine: boolean;
  extraLine?: ExtraLineType;
  wasRemoved?: boolean;
}

export enum ExtraLineType {
  padding,
  manualTyped,
}

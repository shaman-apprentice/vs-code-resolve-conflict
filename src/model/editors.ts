import * as vscode from 'vscode';

import { IChangesLine, IMergeResultLine } from './line';
import { ISingleGitChange } from './git-conflict';

export interface IEditors {
  localChanges: vscode.TextEditor;
  mergeResult: vscode.TextEditor;
  remoteChanges: vscode.TextEditor;
}

export interface IData {
  localChanges: IEditorVersionData;
  mergeResult: IEditorMergeResultData;
  remoteChanges: IEditorVersionData;
}

export interface IEditorVersionData {
  lines: IChangesLine[];
  conflicts: ISingleGitChange[];
  addedDecorations: vscode.DecorationOptions[];
}

export interface IEditorMergeResultData {
  lines: IMergeResultLine[];
  removedDecorations: vscode.DecorationOptions[];
}

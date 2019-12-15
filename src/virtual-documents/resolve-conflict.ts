import * as vscode from 'vscode';
import { StateManager } from '../controller/state-manager';

import {
  getLocalChanges,
  getMergeResult,
  getRemoteChanges,
} from '../controller/editors/content';

export const SCHEMA = 'shaman-apprentice_resolve-conflict_schema';
export const types = Object.freeze({
  local: 'local',
  result: 'result',
  remote: 'remote',
});

export class ResolveConflictProvider implements vscode.TextDocumentContentProvider {
  private static instance: ResolveConflictProvider | undefined;

  private onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  public onDidChange = this.onDidChangeEmitter.event;

  constructor() {
    ResolveConflictProvider.instance = this;
  }

  static updateContent() {
    Object.values(StateManager.editors).forEach((e: any) => {
      const uri = e.document.uri;
      ResolveConflictProvider.instance!.onDidChangeEmitter.fire(uri);
    });
  }

  provideTextDocumentContent(uri: vscode.Uri) {
    switch (uri.query) {
      case types.local:
        return getLocalChanges(StateManager.conflict);
      case types.result:
        return getMergeResult(StateManager.conflict);
      case types.remote:
        return getRemoteChanges(StateManager.conflict);
    }
  }
}

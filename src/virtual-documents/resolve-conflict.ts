import * as vscode from 'vscode';
import { StateManager } from '../controller/state-manager';

import {
  getLocalChanges,
  getMergeResult,
  getRemoteChanges,
} from '../controller/editors/content';

export const SCHEMA = 'shaman-apprentice_resolve-conflict_schema';

export const PATHS = Object.freeze({
  localChanges: 'Local changes (read only)',
  mergeResult: 'Merge Result',
  remoteChanges: 'Remote changes (read only)',
});

export class ResolveConflictProvider implements vscode.TextDocumentContentProvider {
  private static instance: ResolveConflictProvider | undefined;

  private onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event; // todo private possible?

  constructor() {
    ResolveConflictProvider.instance = this;
  }

  static updateContent() {
    if (!ResolveConflictProvider.instance) return;

    Object.values(PATHS).forEach(p => {
      const uri = vscode.Uri.parse(`${SCHEMA}:${p}`);
      ResolveConflictProvider.instance!.onDidChangeEmitter.fire(uri);
    });
  }

  provideTextDocumentContent(uri: vscode.Uri) {
    switch (uri.path) {
      case PATHS.localChanges:
        return getLocalChanges(StateManager.conflict);
      case PATHS.mergeResult:
        return getMergeResult(StateManager.conflict);
      case PATHS.remoteChanges:
        return getRemoteChanges(StateManager.conflict);
    }
  }
}

import * as vscode from 'vscode';
import { StateManager } from '../controller/state-manager';

import { getLocalChanges, getRemoteChanges } from '../controller/editors/content';

export class VersionProvider implements vscode.TextDocumentContentProvider {
  public static readonly schema = 'shaman-apprentice_version_schema';
  public static types = Object.freeze({
    local: 'local',
    remote: 'remote',
  });

  private static instance: VersionProvider | undefined;

  private onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  public onDidChange = this.onDidChangeEmitter.event;

  constructor() {
    VersionProvider.instance = this;
  }

  static updateContent() {
    VersionProvider.instance!.onDidChangeEmitter.fire(
      StateManager.editors.localChanges.document.uri
    );
    VersionProvider.instance!.onDidChangeEmitter.fire(
      StateManager.editors.remoteChanges.document.uri
    );
  }

  provideTextDocumentContent(uri: vscode.Uri) {
    switch (uri.query) {
      case VersionProvider.types.local:
        return getLocalChanges(StateManager.conflict);
      case VersionProvider.types.remote:
        return getRemoteChanges(StateManager.conflict);
    }
  }
}

import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';
import { linesToText } from '../controller/editors/editors-utilities';

export class VersionProvider implements vscode.TextDocumentContentProvider {
  public static readonly scheme =
    'shaman-apprentice_resolve-conflict_version_scheme';
  public static types = Object.freeze({
    localChanges: 'localChanges',
    remoteChanges: 'remoteChanges',
  });

  private onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  private static instance: VersionProvider | undefined;

  constructor() {
    VersionProvider.instance = this;
  }

  static fireUpdateContent() {
    [
      StateManager.editors.localChanges.document.uri,
      StateManager.editors.remoteChanges.document.uri,
    ].forEach(uri => VersionProvider.instance?.onDidChangeEmitter.fire(uri));
  }

  provideTextDocumentContent(uri: vscode.Uri) {
    switch (uri.query) {
      case VersionProvider.types.localChanges:
        return linesToText(StateManager.data.localChanges.lines);
      case VersionProvider.types.remoteChanges:
        return linesToText(StateManager.data.remoteChanges.lines);
    }
  }
}

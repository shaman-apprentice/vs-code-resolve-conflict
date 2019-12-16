import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';
import { getLocalChanges, getRemoteChanges } from '../controller/editors/content';

import { UpdatableDocument } from './updatable-document';

export class VersionProvider extends UpdatableDocument<vscode.Uri>
  implements vscode.TextDocumentContentProvider {
  public static readonly scheme =
    'shaman-apprentice_resolve-conflict_version_scheme';
  public static types = Object.freeze({
    local: 'local',
    remote: 'remote',
  });

  protected getChangeEvents() {
    return [
      StateManager.editors.localChanges.document.uri,
      StateManager.editors.remoteChanges.document.uri,
    ];
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

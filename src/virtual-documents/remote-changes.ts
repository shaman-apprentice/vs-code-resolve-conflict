import * as vscode from 'vscode';

export const REMOTE_CHANGES_SCHEME =
  'shaman-apprentice_resolve-conflict_server-changes-scheme';

export class RemoteChangesProvider implements vscode.TextDocumentContentProvider {
  provideTextDocumentContent(uri: vscode.Uri) {
    return 'hi from server changes';
  }
}

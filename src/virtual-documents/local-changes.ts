import * as vscode from 'vscode';

export const LOCAL_CHANGES_SCHEME =
  'shaman-apprentice_resolve-conflict_local-changes-scheme';

export class LocalChangesProvider implements vscode.TextDocumentContentProvider {
  provideTextDocumentContent(uri: vscode.Uri) {
    return 'hi from local changes';
  }
}

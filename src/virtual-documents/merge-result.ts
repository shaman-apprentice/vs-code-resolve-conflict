import * as vscode from 'vscode';

export const MERGE_RESULT_SCHEME =
  'shaman-apprentice_resolve-conflict_merge-result-scheme';

export class MergeResultProvider implements vscode.TextDocumentContentProvider {
  provideTextDocumentContent(uri: vscode.Uri) {
    return 'hi from merge Result';
  }
}

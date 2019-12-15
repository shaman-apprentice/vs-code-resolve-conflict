import * as vscode from 'vscode';
import { StateManager } from '../controller/state-manager';

export const MERGE_RESULT_SCHEME =
  'shaman-apprentice_resolve-conflict_merge-result-scheme';

export class MergeResultProvider implements vscode.TextDocumentContentProvider {
  provideTextDocumentContent(uri: vscode.Uri) {
    return StateManager.conflict.mergeResult.join('\n');
  }
}

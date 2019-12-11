import * as vscode from 'vscode';
import { StateManager } from '../utilities/state-manager';
import { ILine } from '../utilities/conflict.interface';

export const MERGE_RESULT_SCHEME =
  'shaman-apprentice_resolve-conflict_merge-result-scheme';

export class MergeResultProvider implements vscode.TextDocumentContentProvider {
  provideTextDocumentContent(uri: vscode.Uri) {
    return StateManager.conflict.mergeResult
      .map((line: ILine) => line.content)
      .join('\n');
  }
}

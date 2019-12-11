import * as vscode from 'vscode';
import { StateManager } from '../utilities/state-manager';
import { ILine } from '../utilities/conflict.interface';

export const LOCAL_CHANGES_SCHEME =
  'shaman-apprentice_resolve-conflict_local-changes-scheme';

export class LocalChangesProvider implements vscode.TextDocumentContentProvider {
  provideTextDocumentContent(uri: vscode.Uri) {
    return StateManager.conflict.localChanges
      .map((line: ILine) => line.content)
      .join('\n');
  }
}

import * as vscode from 'vscode';
import { StateManager } from '../controller/state-manager';

export const LOCAL_CHANGES_SCHEME =
  'shaman-apprentice_resolve-conflict_local-changes-scheme';

export class LocalChangesProvider implements vscode.TextDocumentContentProvider {
  public onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  public static instance: LocalChangesProvider | undefined;
  public constructor() {
    LocalChangesProvider.instance = this;
  }

  provideTextDocumentContent(uri: vscode.Uri) {
    const contentLines = StateManager.conflict.localChanges.reduce(
      (acc: any, conflict) => {
        if (conflict.addedLines.length)
          acc.splice(conflict.startLineAdded, 0, ...conflict.addedLines);

        return acc;
      },
      StateManager.conflict.mergeResult.slice()
    );

    return contentLines.join('\n');
  }
}

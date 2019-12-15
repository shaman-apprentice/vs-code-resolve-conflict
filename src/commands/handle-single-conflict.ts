import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';
import { LocalChangesProvider } from '../virtual-documents/local-changes';

export interface IHandleSingleConflictArgs {
  conflictNumber: number;
  shouldUse: boolean;
  type: 'local' | 'remote';
}

export const handleSingleConflict = async (args: IHandleSingleConflictArgs) => {
  const [resolvingConflict] = StateManager.conflict.localChanges.splice(
    args.conflictNumber,
    1
  );

  if (args.type === 'local') {
    if (args.shouldUse) {
      console.log('updating mergeResult');
      // remove related lines
      StateManager.conflict.mergeResult.splice(
        resolvingConflict.startLineRemoved,
        resolvingConflict.removedLines.length
      );
      // add related lines
      StateManager.conflict.mergeResult.splice(
        resolvingConflict.startLineAdded,
        0,
        ...resolvingConflict.addedLines
      );
    }
  }

  LocalChangesProvider.instance!.onDidChangeEmitter.fire(
    vscode.Uri.parse(
      'shaman-apprentice_resolve-conflict_local-changes-scheme:Local changes (read only)'
    )
  );
  console.log('fired');
  setTimeout(() => {
    StateManager.applyDecorations();
  }, 1000);

  // todo other cases
};

import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';
import { ResolveConflictProvider } from '../virtual-documents/resolve-conflict';

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

  ResolveConflictProvider.updateContent();

  setTimeout(() => {
    StateManager.applyDecorations();
  }, 1000);

  // todo other cases
};

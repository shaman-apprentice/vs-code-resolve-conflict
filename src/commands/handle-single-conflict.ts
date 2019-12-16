import { StateManager } from '../controller/state-manager';
import { fireContentChanged } from '../controller/editors/content';

export interface IHandleSingleConflictArgs {
  conflictNumber: number;
  shouldUse: boolean;
  type: 'local' | 'remote'; // todo enum from version-provider
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
    // todo other cases
  }

  fireContentChanged();
};

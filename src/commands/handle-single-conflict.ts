import { StateManager } from '../controller/state-manager';
import { VersionProvider } from '../virtual-documents/version-provider';
import { MergeResultProvider } from '../virtual-documents/merge-result-provider';

export interface IHandleSingleConflictArgs {
  conflictNumber: number;
  shouldUse: boolean;
  type: 'local' | 'remote'; // todo enum from version-provider
}

export const handleSingleConflict = async (args: IHandleSingleConflictArgs) => {
  const [resolvingConflict] = StateManager.gitConflict.localChanges.splice(
    args.conflictNumber,
    1
  );

  if (args.type === 'local') {
    if (args.shouldUse) {
      // remove related lines
      StateManager.gitConflict.commonAncestor.splice(
        resolvingConflict.startRemoved,
        resolvingConflict.removedLines.length
      );
      // add related lines
      StateManager.gitConflict.commonAncestor.splice(
        resolvingConflict.startAdded,
        0,
        ...resolvingConflict.addedLines
      );
    }
    // todo other cases
  }

  VersionProvider.fireUpdateContent();
  MergeResultProvider.fireUpdateContent();
};

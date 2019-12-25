import { StateManager } from '../controller/state-manager';
import { VersionProvider } from '../virtual-documents/version-provider';
import { MergeResultProvider } from '../virtual-documents/merge-result-provider';

export interface IHandleSingleConflictArgs {
  conflictNumber: number;
  shouldUse: boolean;
  type: 'local' | 'remote'; // todo enum from version-provider
}

export const handleSingleConflict = async (args: IHandleSingleConflictArgs) => {
  console.log(
    'handling single conflict',
    args.type,
    args.shouldUse,
    args.conflictNumber
  );
  if (args.type === 'local') {
    if (args.shouldUse) {
    }
    // todo other cases
  }

  VersionProvider.fireUpdateContent();
  MergeResultProvider.fireUpdateContent();
};

import { StateManager } from '../controller/state-manager';
import { VersionProvider } from '../virtual-documents/version-provider';
import { MergeResultProvider } from '../virtual-documents/merge-result-provider';
import { IHandleSingleConflictArgs, VersionType } from '../model/git-conflict';

export const handleSingleConflict = async (args: IHandleSingleConflictArgs) => {
  console.log(args);
  if (args.type === VersionType.local) {
    if (args.shouldUse) {
    }
    // todo other cases
  }

  VersionProvider.fireUpdateContent();
  MergeResultProvider.fireUpdateContent();
};

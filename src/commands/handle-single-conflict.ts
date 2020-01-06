import { StateManager } from '../controller/state-manager';
import { MergeResultProvider } from '../virtual-documents/merge-result-provider';
import { IHandleSingleConflictArgs, VersionType } from '../model/git-conflict';

export const handleSingleConflict = async (args: IHandleSingleConflictArgs) => {
  const changes =
    args.type === VersionType.local
      ? StateManager.data.localChanges
      : StateManager.data.remoteChanges;

  changes.conflicts[args.conflictIndex].isResolved = true;

  for (let i = args.startLine; i <= args.endLine; i++) {
    const mrLine = StateManager.data.mergeResult.lines[i];

    if (args.type === VersionType.local) mrLine.wasRemovedLocal = false;
    else mrLine.wasRemovedRemote = false;

    if (args.shouldUse) {
      const line =
        args.type === VersionType.local
          ? StateManager.data.localChanges.lines[i]
          : StateManager.data.remoteChanges.lines[i];
      mrLine.content = line.content;
      mrLine.isAlignmentPadding = line.isAlignmentPadding;
    }
  }

  if (args.shouldUse) MergeResultProvider.fireUpdateContent();
  StateManager.applyDecorations();
};

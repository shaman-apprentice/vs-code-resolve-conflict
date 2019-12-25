import { IMergeResultLine } from '../../model/line';
import { ISingleGitConflict } from '../../model/git-conflict';

export const initTmpChanges = (commonAncestor: string[]) =>
  commonAncestor.slice().map(line => ({
    content: [line],
    paddingBottom: 0,
    wasAdded: false,
  }));

export const markRemovedLines = (
  mergeResult: IMergeResultLine[],
  lc: ISingleGitConflict
) => {
  let index = lc.startAdded;
  const lastIndex = lc.startAdded + lc.removedLines.length - 1;

  for (index; index <= lastIndex; index++) mergeResult[index].wasRemoved = true;
};

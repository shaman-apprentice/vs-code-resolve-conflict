import { ISingleGitConflict } from '../../model/git-conflict';
import { IMergeResultLine, IVersionLine } from '../../model/line';

/** returns localChanges and updates padding of mergeResultLines as side effect */
export const parseLocalChanges = (
  commonAncestor: string[],
  localChanges: ISingleGitConflict[],
  mergeResult: IMergeResultLine[]
): IVersionLine[] => {
  const tmpLocalChanges: IVersionLine[] = commonAncestor.slice().map(line => ({
    content: [line],
    paddingBottom: 0,
    wasAdded: false,
  }));

  return localChanges
    .slice()
    .reverse() // calculation of padding is easier when doing from the end
    .reduce((acc, lc) => {
      const addedLines = {
        content: lc.addedLines,
        paddingBottom: 0,
        wasAdded: true,
      };

      if (lc.addedLines.length < lc.removedLines.length) {
        addedLines.paddingBottom = lc.removedLines.length - lc.addedLines.length;
      } else if (lc.addedLines.length > lc.removedLines.length) {
        mergeResult[lc.startRemoved + lc.removedLines.length - 1].paddingBottom =
          lc.addedLines.length - lc.removedLines.length;
      }

      tmpLocalChanges.splice(lc.startRemoved, lc.removedLines.length);
      tmpLocalChanges.splice(lc.startAdded, 0, addedLines);

      markRemovedLines(mergeResult, lc);

      return acc;
    }, tmpLocalChanges);
};

const markRemovedLines = (
  mergeResult: IMergeResultLine[],
  lc: ISingleGitConflict
) => {
  let index = lc.startAdded;
  const lastIndex = lc.startAdded + lc.removedLines.length - 1;

  for (index; index <= lastIndex; index++) mergeResult[index].wasRemoved = true;
};

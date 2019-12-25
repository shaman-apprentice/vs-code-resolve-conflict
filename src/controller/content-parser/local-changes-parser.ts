import { ISingleGitConflict } from '../../model/git-conflict';
import { IMergeResultLine, IVersionLine } from '../../model/line';
import { markRemovedLines, initTmpChanges } from './utilities';

/** returns localChanges and updates padding of parsedMergeResultLines as side effect */
export const parseLocalChanges = (
  commonAncestor: string[],
  localConflict: ISingleGitConflict[],
  parsedMergeResult: IMergeResultLine[]
): IVersionLine[] => {
  const tmpLocalChanges: IVersionLine[] = initTmpChanges(commonAncestor);

  return localConflict.reduce((acc, lc) => {
    const addedLines = {
      content: lc.addedLines,
      paddingBottom: 0,
      wasAdded: true,
    };

    if (lc.addedLines.length < lc.removedLines.length) {
      addedLines.paddingBottom = lc.removedLines.length - lc.addedLines.length;
    } else if (lc.addedLines.length > lc.removedLines.length) {
      parsedMergeResult[lc.startRemoved + lc.removedLines.length - 1].paddingBottom =
        lc.addedLines.length - lc.removedLines.length;
    }

    tmpLocalChanges.splice(lc.startRemoved, lc.removedLines.length);
    tmpLocalChanges.splice(lc.startAdded, 0, addedLines);

    markRemovedLines(parsedMergeResult, lc);

    return acc;
  }, tmpLocalChanges);
};

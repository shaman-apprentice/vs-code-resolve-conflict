import { ISingleGitConflict } from '../../model/git-conflict';
import { IMergeResultLine, IVersionLine } from '../../model/line';
import { markRemovedLines, initTmpChanges } from './utilities';

/** returns remoteChanges and updates padding of parsedMergeResultLines and parsedLocalChanges as side effect */
export const parseRemoteChanges = (
  commonAncestor: string[],
  remoteConflicts: ISingleGitConflict[],
  parsedMergeResult: IMergeResultLine[],
  parsedLocalChanges: IVersionLine[]
): IVersionLine[] => {
  const tmpRemoteChanges: IVersionLine[] = initTmpChanges(commonAncestor);

  return remoteConflicts.reduce((acc, rc) => {
    const addedLines = {
      content: rc.addedLines,
      paddingBottom: 0,
      wasAdded: true,
    };

    if (rc.addedLines.length < rc.removedLines.length) {
      addedLines.paddingBottom = rc.removedLines.length - rc.addedLines.length;
      // todo: + related padding of merge result
    } else if (rc.addedLines.length > rc.removedLines.length) {
      const neededPadding = rc.addedLines.length - rc.removedLines.length;
      const relatedMergeResultLine =
        parsedMergeResult[rc.startRemoved + rc.removedLines.length - 1];
      if (relatedMergeResultLine.paddingBottom >= neededPadding) {
        // padding is already there due to local changes
      } else {
        const newPadding = neededPadding - relatedMergeResultLine.paddingBottom;
        // relatedMergeResultLine.paddingBottom += newPadding;
        // todo
        // update relatedMergeResultLine's and parsedLocalChanges's paddingBottom
      }
    }

    tmpRemoteChanges.splice(rc.startRemoved, rc.removedLines.length);
    tmpRemoteChanges.splice(rc.startAdded, 0, addedLines);

    markRemovedLines(parsedMergeResult, rc);

    return acc;
  }, tmpRemoteChanges);
};

const getRelatedLocalChangesLine = (
  parsedLocalChanges: IVersionLine[],
  mergeResult: IMergeResultLine[],
  mergeResultIndex: number
) => {};

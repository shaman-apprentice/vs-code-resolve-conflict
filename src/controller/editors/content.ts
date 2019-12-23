import { ISingleGitConflict } from '../../model/git-conflict';
import { IMergeResultLine, IVersionLine } from '../../model/line';

/* 
Parse flow from IGitConflict:
1. get mergeResult lines: from common ancestor
2. get localChange lines: from mergeResult and add needed padding-lines in both
3. get remoteChanges lines: from merge Result and add needed padding-lines in all three
*/

//TODO test first this before doing more

/** returns localChanges and updates padding of mergeResultLines as side effect */
export const getLocalChanges = (
  commonAncestor: string[],
  localChanges: ISingleGitConflict[],
  mergeResult: IMergeResultLine[]
): IVersionLine[] => {
  const tmp: IVersionLine[] = commonAncestor.slice().map(line => ({
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
        // add padding to related mergeResultLine
      }

      tmp.splice(lc.startRemoved, lc.removedLines.length);
      tmp.splice(lc.startAdded, 0, addedLines);

      return acc;
    }, tmp);
};

export const getMergeResult = (
  commonAncestor: string[],
  manualAddedLines: [] // todo
): IMergeResultLine[] =>
  commonAncestor.map(line => ({
    content: [line],
    paddingBottom: 0,
    wasRemoved: false,
    wasManualAdded: false, // // todo add via reduce manualAddedLines
  }));

export const getRemoteChanges = (conflict: any): string => {
  return 'todo: static content so far';
};

import { IGitConflict } from '../../model/git-conflict';
import { parseLocalChanges } from './local-changes-parser';
import { IVersionLine } from '../../model/line';

/**
 * Parse flow from IGitConflict:
 * 1. get mergeResult lines: from common ancestor
 * 2. get localChange lines: from mergeResult and add needed padding-lines in both
 * 3. get remoteChanges lines: from merge Result and add needed padding-lines in all three
 */
export const parseInitialConflict = (gitConflict: IGitConflict) => {
  let tmpMergeResult = gitConflict.commonAncestor.map((line: string) => ({
    content: [line],
    paddingBottom: 0,
    wasManualAdded: false,
    wasRemoved: false,
  }));

  let tmpLocalChanges = parseLocalChanges(
    gitConflict.commonAncestor,
    gitConflict.localChanges,
    tmpMergeResult
  );

  return {
    commonAncestor: gitConflict.commonAncestor,
    localChanges: tmpLocalChanges,
    mergeResult: tmpMergeResult,
    remoteChanges: [] as IVersionLine[],
    manualAddedLines: [],
  };
};

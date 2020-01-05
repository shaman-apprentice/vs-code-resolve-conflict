import { getCommonAncestorContent, getConflictObjectIds, getDiff } from './git-cmds';
import { IGitChanges, ISingleGitChange } from '../../model/git-conflict';

export const parseGitConflict = async (fsPath: string): Promise<IGitChanges> => {
  const [ancestorId, localId, remoteId] = await getConflictObjectIds(fsPath);

  return {
    localChanges: parseDiff(await getDiff(fsPath, ancestorId, localId)),
    commonAncestor: await getCommonAncestorContent(fsPath),
    remoteChanges: parseDiff(await getDiff(fsPath, ancestorId, remoteId)),
  };
};

export const parseDiff = (diff: string): ISingleGitChange[] =>
  diff
    .split('\n')
    .slice(4) // throw away fst 4 rows / meta data
    .reduce((acc, line) => {
      if (line.startsWith('@')) {
        acc.push({
          // note that git starts line counting with one, but we represent lines as arrays and hence start with 0
          startRemoved: parseInt(line.match(startLineRemovedRegEx)![1]) - 1,
          removedLines: [],
          startAdded: parseInt(line.match(startLineAddedRegEx)![1]) - 1,
          addedLines: [],
        });
        return acc;
      }

      const current = acc[acc.length - 1];
      if (line.startsWith('-')) current.removedLines.push(line.slice(1));
      if (line.startsWith('+')) current.addedLines.push(line.slice(1));

      return acc;
    }, [] as ISingleGitChange[]);

const startLineRemovedRegEx = /-([0-9]*)/;
const startLineAddedRegEx = /\+([0-9]*)/;

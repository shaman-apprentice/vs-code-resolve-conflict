import {
  getCommonAncestorContent,
  getConflictObjectIds,
  getDiff,
} from '../git-cmds';
import { IConflict, ILocalConflict } from './conflict.interface';

export const init = async (fsPath: string): Promise<IConflict> => {
  const content = await getCommonAncestorContent(fsPath);
  const [ancestorId, localId, remoteId] = await getConflictObjectIds(fsPath);

  return {
    localChanges: parseDiff(await getDiff(fsPath, ancestorId, localId)),
    mergeResult: content.split('\n'),
    remoteChanges: 'todo - currently still a static string',
  };
};

export const parseDiff = (diff: string): ILocalConflict[] =>
  diff
    .split('\n')
    .slice(4) // throw away fst 4 rows / meta data
    .reduce((acc: ILocalConflict[], line) => {
      if (line.startsWith('@')) {
        acc.push({
          // note that git starts line counting with one, but we represent lines as arrays and hence start with 0
          startLineRemoved: parseInt(line.match(startLineRemovedRegEx)![1]) - 1,
          removedLines: [],
          startLineAdded: parseInt(line.match(startLineAddedRegEx)![1]) - 1,
          addedLines: [],
        });
        return acc;
      }

      const current = acc[acc.length - 1];
      if (line.startsWith('-')) current.removedLines.push(line.slice(1));
      if (line.startsWith('+')) current.addedLines.push(line.slice(1));

      return acc;
    }, [] as ILocalConflict[]);

const startLineRemovedRegEx = /-([0-9]*)/;
const startLineAddedRegEx = /\+([0-9]*)/;

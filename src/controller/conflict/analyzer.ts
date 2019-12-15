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

const parseDiff = (diff: string): ILocalConflict[] => {
  // todo mocked implementation only so far
  return [
    {
      startLineRemoved: 2,
      removedLines: [''],
      startLineAdded: 2,
      addedLines: ['line 2 says hi as well'],
    },
  ];
};

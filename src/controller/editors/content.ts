import { IConflict } from '../conflict/conflict.interface';

export const getLocalChanges = (conflict: IConflict): string => {
  const contentLines = conflict.localChanges.reduce((acc: any, c) => {
    if (c.addedLines.length) {
      acc.splice(c.startLineAdded, 0, ...c.addedLines);
    }

    return acc;
  }, conflict.mergeResult.slice());

  return contentLines.join('\n');
};

export const getMergeResult = (conflict: IConflict): string => {
  return conflict.mergeResult.join('\n');
};

export const getRemoteChanges = (conflict: IConflict): string => {
  return 'todo: static content so far';
};

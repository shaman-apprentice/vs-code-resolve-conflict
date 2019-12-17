import { IConflict, ILocalConflict } from '../conflict/conflict.interface';
import { MergeResultProvider } from '../../virtual-documents/merge-result-provider';
import { VersionProvider } from '../../virtual-documents/version-provider';

export const getLocalChanges = (conflict: IConflict): string =>
  getTextContent(conflict.mergeResult, conflict.localChanges);

export const getMergeResult = (conflict: IConflict): string => {
  return conflict.mergeResult.join('\n');
};

export const getRemoteChanges = (conflict: IConflict): string => {
  return 'todo: static content so far';
};

export const fireContentChanged = () => {
  VersionProvider.fireUpdateContent();
  MergeResultProvider.fireUpdateContent();
};

export const getTextContent = (commonAncestor: string[], lcs: ILocalConflict[]) =>
  lcs
    .slice() // cause .reverse in next line is an inplace operation - thx JS!
    .reverse()
    .reduce((acc, lc) => {
      acc.splice(lc.startLineRemoved + lc.removedLines.length, 0, ...lc.addedLines);
      return acc;
    }, commonAncestor.slice())
    .join('\n');

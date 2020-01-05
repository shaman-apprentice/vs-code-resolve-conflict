import { IMergeResultLine, IChangesLine } from '../../model/line';
import { ISingleGitChange } from '../../model/git-conflict';

export const parseInitialMergeResult = (
  commonAncestor: string
): IMergeResultLine[] =>
  commonAncestor.split('\n').map((line, i) => ({
    content: line,
  }));

export const parseLocalChanges = (
  changes: ISingleGitChange[],
  commonAncestor: string,
  mergeResult: IMergeResultLine[]
): IChangesLine[] => {
  let offset = 0; // offset to common ancestor due to more added than remove lines
  return changes.reduce((acc, change) => {
    insertAddedLines(acc, change, offset);
    markLinesAsRemoves(mergeResult, change, offset, true);

    // update alignment padding
    const lineDiff = change.addedLines.length - change.removedLines.length;
    if (lineDiff > 0) {
      // add padding to merge result
      const paddingStart = change.startRemoved + change.removedLines.length + offset;
      offset += lineDiff;
      mergeResult.splice(paddingStart, 0, ...getPaddingLines(lineDiff));
    } else if (lineDiff < 0) {
      // add padding to local version
      const paddingStart = change.startAdded + change.addedLines.length + offset;
      acc.splice(paddingStart, 0, ...getPaddingLines(-1 * lineDiff));
    }

    return acc;
  }, getInitialVersionLines(commonAncestor));
};

export const parseRemoteChanges = (
  changes: ISingleGitChange[],
  commonAncestor: string,
  mergeResult: IMergeResultLine[],
  localLines: IChangesLine[]
): IChangesLine[] => {
  let offset = 0; // offset to common ancestor due to more added than remove lines
  let nmrLine = 0; // next merge result line to visit
  const lines = changes.reduce((acc, change) => {
    // update already existing padding from merge result until this change (caused by parsed local changes)
    for (nmrLine; nmrLine < change.startRemoved + offset + 1; nmrLine++)
      if (mergeResult[nmrLine].isAlignmentPadding) {
        acc.splice(nmrLine, 0, ...getPaddingLines(1));
        offset += 1;
      }

    // handle change
    insertAddedLines(acc, change, offset);
    markLinesAsRemoves(mergeResult, change, offset, false);

    // update alignment padding caused by this change
    const lineDiff = change.addedLines.length - change.removedLines.length;
    if (lineDiff > 0) {
      // add padding to merge result and local version
      const paddingStart = change.startRemoved + change.removedLines.length + offset;
      offset += lineDiff;
      mergeResult.splice(paddingStart, 0, ...getPaddingLines(lineDiff));
      localLines.splice(paddingStart, 0, ...getPaddingLines(lineDiff));
    } else if (lineDiff < 0) {
      // add padding to remote version
      const paddingStart = change.startAdded + change.addedLines.length + offset;
      acc.splice(paddingStart, 0, ...getPaddingLines(-1 * lineDiff));
    }
    nmrLine += Math.max(change.addedLines.length, change.removedLines.length) + 1;

    return acc;
  }, getInitialVersionLines(commonAncestor));

  // copy remaining padding from merge result to remote changes
  for (nmrLine; nmrLine < mergeResult.length; nmrLine++)
    if (mergeResult[nmrLine].isAlignmentPadding)
      lines.splice(nmrLine, 0, ...getPaddingLines(1));

  return lines;
};

const insertAddedLines = (
  lines: IChangesLine[],
  change: ISingleGitChange,
  lineOffset: number
) => {
  const addedLines = change.addedLines.map(line => ({
    content: line,
    wasAdded: true,
  }));
  lines.splice(change.startRemoved + lineOffset, change.removedLines.length);
  lines.splice(change.startAdded + lineOffset, 0, ...addedLines);
};

const markLinesAsRemoves = (
  mergeResult: IMergeResultLine[],
  change: ISingleGitChange,
  lineOffset: number,
  fromLocal: boolean
) => {
  const startRemoved = change.startRemoved + lineOffset;
  for (let i = 0; i < change.removedLines.length; i++)
    if (fromLocal) mergeResult[startRemoved + i].wasRemovedLocal = true;
    else mergeResult[startRemoved + i].wasRemovedRemote = true;
};

const getPaddingLines = (count: number) =>
  Array.from({ length: count }).map(() => ({
    content: '',
    isAlignmentPadding: true,
  }));

const getInitialVersionLines = (commonAncestor: string): IChangesLine[] =>
  commonAncestor.split('\n').map(line => ({
    content: line,
    wasAdded: false,
  })) as IChangesLine[];

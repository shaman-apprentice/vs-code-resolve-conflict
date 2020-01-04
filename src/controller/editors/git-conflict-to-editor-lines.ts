import { IMergeResultLine, IChangesLine, ExtraLineType } from '../../model/editors';
import { ISingleGitChange } from '../../model/git-conflict';

export const getInitialMergeResult = (commonAncestor: string): IMergeResultLine[] =>
  commonAncestor.split('\n').map((line, i) => ({
    content: line,
    isLocalLine: true,
    isRemoteLine: true,
    wasRemoved: false,
  }));

/** returns {lines, addedDecorations} and updates mergeResult[x].matchesLocal/RemoteVersionLine if needed */
export const parseGitChangesToLines = (
  type: 'local' | 'remote',
  changes: ISingleGitChange[],
  commonAncestor: string[],
  mergeResult: IMergeResultLine[]
): IChangesLine[] => {
  const reduced = changes.reduce(
    (acc, change) => {
      updateLines(acc, change);

      updateMergeResult(
        type,
        change,
        mergeResult,
        change.startRemoved + acc.lineOffset
      );

      acc.lineOffset += Math.abs(
        change.addedLines.length - change.removedLines.length
      );

      return acc;
    },
    {
      lines: commonAncestor.map(line => ({ content: line, wasAdded: false })),
      lineOffset: 0,
    }
  );

  return reduced.lines;
};

const updateLines = (acc: any, change: ISingleGitChange) => {
  const addedLines = change.addedLines.map(line => ({
    content: line,
    wasAdded: true,
  }));
  acc.lines.splice(change.startRemoved, change.removedLines.length);
  acc.lines.splice(change.startAdded, 0, ...addedLines);
};

const updateMergeResult = (
  type: 'local' | 'remote',
  change: ISingleGitChange,
  mergeResult: IMergeResultLine[],
  startIndex: number
) => {
  let lineIndex = startIndex;
  for (lineIndex; lineIndex < startIndex + change.removedLines.length; lineIndex++)
    mergeResult[lineIndex].wasRemoved = true;

  let lineDiff = change.addedLines.length - change.removedLines.length;

  if (lineDiff > 0) {
    // more ADDED lines -> add padding lines to merge Result
    // TODO Take existing non local/REMOTE lines into account
    mergeResult.splice(lineIndex, 0, ...getPaddingLines(lineDiff));
  } else if (lineDiff < 0) {
    // more REMOVED lines -> update related mergeResult.isLocalVersion
    for (lineDiff; lineDiff < 0; lineDiff++)
      mergeResult[lineIndex + lineDiff].isLocalLine = false;
  }
};

const getPaddingLines = (count: number) =>
  new Array(count).map(() => ({
    content: '',
    isLocalLine: false,
    isRemoteLine: false,
    extraLine: ExtraLineType.padding,
  }));

import { IMergeResultLine } from '../../model/line';

export const getFstLineContent = (
  mergeResultLines: IMergeResultLine[],
  newLines: string[],
  startLine: number,
  startChar: number,
  endLine: number,
  endChar: number
) =>
  replaceSubStr(
    mergeResultLines[startLine].content,
    startChar,
    endLine - startLine === 0 ? endChar : mergeResultLines[startLine].content.length,
    newLines[0]
  );

export const getLastLineContent = (
  mergeResultLines: IMergeResultLine[],
  newLines: string[],
  endLine: number,
  endChar: number
) =>
  newLines[newLines.length - 1] + mergeResultLines[endLine].content.slice(endChar);

export const replaceSubStr = (
  s: string,
  start: number,
  end: number,
  replacement: string
) => s.slice(0, start) + replacement + s.slice(end);

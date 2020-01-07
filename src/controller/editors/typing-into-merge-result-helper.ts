import { IMergeResultLine } from '../../model/line';

export const getFstLineContent = (
  mrLines: IMergeResultLine[],
  newLines: string[],
  startLine: number,
  startChar: number,
  endLine: number,
  endChar: number
) =>
  replaceSubStr(
    mrLines[startLine].content,
    startChar,
    endLine - startLine > 0 || newLines.length > 1
      ? mrLines[startLine].content.length
      : endChar,
    newLines[0]
  );

export const getLastLineContent = (
  mrLines: IMergeResultLine[],
  newLines: string[],
  endLine: number,
  endChar: number
) => newLines[newLines.length - 1] + mrLines[endLine].content.slice(endChar);

export const replaceSubStr = (
  s: string,
  start: number,
  end: number,
  replacement: string
) => s.slice(0, start) + replacement + s.slice(end);

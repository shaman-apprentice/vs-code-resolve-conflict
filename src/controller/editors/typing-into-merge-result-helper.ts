import { IMergeResultLine, IChangesLine } from '../../model/line';

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

export const insertLine = (
  mrLines: IMergeResultLine[],
  index: number,
  content: string,
  localLines: IChangesLine[],
  wasLocalAdded: boolean,
  remoteLines: IChangesLine[],
  wasRemoteAdded: boolean
) => {
  mrLines.splice(index, 0, { content });
  insertPaddingLine(localLines, index, wasLocalAdded);
  insertPaddingLine(remoteLines, index, wasRemoteAdded);
};

export const shouldAddWasAddedToPaddingLines = (
  mrLines: IMergeResultLine[],
  lines: IChangesLine[],
  endLine: number,
  endChar: number
) => {
  if (
    lines[endLine].wasAdded &&
    !isAtTheEndOfLine(mrLines[endLine].content, endChar)
  )
    return true;

  if (lines[endLine].wasAdded && wasNextLineAdded(lines, endLine)) return true;

  return false;
};

const wasNextLineAdded = (lines: IChangesLine[], index: number) =>
  index + 1 < lines.length - 1 && lines[index + 1].wasAdded;

const isAtTheEndOfLine = (line: string, endChar: number) =>
  endChar >= line.length - 1;

const insertPaddingLine = (
  lines: IChangesLine[],
  index: number,
  wasAdded: boolean
) =>
  lines.splice(index, 0, {
    content: '',
    isAlignmentPadding: true,
    wasAdded,
  });

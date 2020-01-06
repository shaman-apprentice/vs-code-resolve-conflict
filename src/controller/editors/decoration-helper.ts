import * as vscode from 'vscode';

import {
  IHandleSingleConflictArgs,
  VersionType,
  ISingleGitChange,
} from '../../model/git-conflict';
import { IChangesLine, IMergeResultLine } from '../../model/line';

export const getRemovedDecorations = (lines: IMergeResultLine[]) => {
  let currentLine = 0;
  const removedDecorations = [] as vscode.DecorationOptions[];

  while (currentLine < lines.length) {
    if (!wasRemoved(lines[currentLine])) {
      currentLine += 1;
      continue;
    }

    const startLine = currentLine;
    while (currentLine < lines.length && wasRemoved(lines[currentLine]))
      currentLine++;
    const endLine = currentLine - 1;
    const endChar = lines[endLine].content.length;
    removedDecorations.push(getRemovedDecoration(startLine, endLine, endChar));
  }

  return removedDecorations;
};

export const getAddedDecorations = (
  type: VersionType,
  lines: IChangesLine[],
  conflicts: ISingleGitChange[]
) => {
  let conflictIndex = 0;
  let currentLine = 0;
  const addedDecorations = [] as vscode.DecorationOptions[];

  while (currentLine < lines.length) {
    if (!lines[currentLine].wasAdded) {
      currentLine += 1;
      continue;
    }

    const startLine = currentLine;
    while (currentLine < lines.length && lines[currentLine].wasAdded) currentLine++;
    const endLine = currentLine - 1;
    const endChar = lines[endLine].content.length;
    if (!conflicts[conflictIndex].isResolved)
      addedDecorations.push(
        getAddedDecoration(type, startLine, endLine, endChar, conflictIndex)
      );

    conflictIndex += 1;
  }

  return addedDecorations;
};

const getAddedDecoration = (
  type: VersionType,
  startLine: number,
  endLine: number,
  endChar: number,
  conflictIndex: number
): vscode.DecorationOptions => {
  const hoverOpts = {
    type,
    conflictIndex,
    startLine,
    endLine,
  };
  return {
    range: new vscode.Range(
      new vscode.Position(startLine, 0),
      new vscode.Position(endLine, endChar)
    ),
    hoverMessage: [
      createHover({ ...hoverOpts, shouldUse: true }),
      createHover({ ...hoverOpts, shouldUse: false }),
    ],
  };
};

export const createHover = (args: IHandleSingleConflictArgs) => {
  const description = args.shouldUse ? 'use' : "don't use";
  const encodedArgs = encodeURIComponent(JSON.stringify(args));
  const cmd = vscode.Uri.parse(`command:handle-single-conflict?${encodedArgs}`);
  const hover = new vscode.MarkdownString(`[${description}](${cmd})`);
  hover.isTrusted = true;
  return hover;
};

const wasRemoved = (line: IMergeResultLine) =>
  line.wasRemovedLocal || line.wasRemovedRemote;

const getRemovedDecoration = (
  startLine: number,
  endLine: number,
  endChar: number
): vscode.DecorationOptions => ({
  range: new vscode.Range(
    new vscode.Position(startLine, 0),
    new vscode.Position(endLine, endChar)
  ),
});

import * as vscode from 'vscode';

import {
  IHandleSingleConflictArgs,
  VersionType,
  ISingleGitChange,
} from '../../model/git-conflict';
import { IChangesLine } from '../../model/line';

export const getAddedDecorations = (
  type: VersionType,
  lines: IChangesLine[],
  conflicts: ISingleGitChange[]
) => {
  let conflictIndex = 0;
  let lineIndex = 0;
  const addedDecorations = [] as vscode.DecorationOptions[];

  while (lineIndex < lines.length) {
    if (!lines[lineIndex].wasAdded) {
      lineIndex++;
      continue;
    }

    const startLine = lineIndex;
    while (lineIndex < lines.length && lines[lineIndex].wasAdded) lineIndex++;
    const endLine = startLine + lineIndex - startLine - 1;
    const endChar = lines[endLine].content.length;
    if (!conflicts[conflictIndex].isResolved)
      addedDecorations.push(
        getAddedDecoration(type, startLine, endLine, endChar, conflictIndex)
      );

    conflictIndex += 1;
  }

  return addedDecorations;
};

export const getAddedDecoration = (
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

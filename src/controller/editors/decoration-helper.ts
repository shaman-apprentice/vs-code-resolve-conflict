import * as vscode from 'vscode';

import { IHandleSingleConflictArgs } from '../../commands/handle-single-conflict';

export const getAddedDecoration = (
  startLine: number,
  lines: string[],
  conflictIndex: number
): vscode.DecorationOptions => {
  const endLine = startLine + lines.length - 1;
  const endChar = lines[lines.length - 1].length;
  return {
    range: new vscode.Range(
      new vscode.Position(startLine, 0),
      new vscode.Position(endLine, endChar)
    ),
    hoverMessage: [
      createHover({
        shouldUse: true,
        type: 'local',
        conflictNumber: conflictIndex,
      }),
      createHover({
        shouldUse: false,
        type: 'local', // todo
        conflictNumber: conflictIndex,
      }),
    ],
  };
};

export const createHover = (args: IHandleSingleConflictArgs) => {
  const description = args.shouldUse ? 'use' : "don't use";
  const cmd = getCmd(args);
  const hover = new vscode.MarkdownString(`[${description}](${cmd})`);
  hover.isTrusted = true;
  return hover;
};

const getCmd = (args: IHandleSingleConflictArgs) => {
  const encodedArgs = encodeURIComponent(JSON.stringify(args));
  return vscode.Uri.parse(`command:handle-single-conflict?${encodedArgs}`);
};

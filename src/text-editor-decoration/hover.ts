import * as vscode from 'vscode';
import { IHandleSingleConflictArgs } from '../commands/handle-single-conflict';

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

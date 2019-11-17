import * as vscode from 'vscode';

export const getHover = () => {
  const cmd = vscode.Uri.parse('command:open-local-changes');
  const hover = new vscode.MarkdownString(`[do something](${cmd})`);
  hover.isTrusted = true;
  return hover;
};

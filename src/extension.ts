import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'open-resolve-conflict',
    openResolveConflict
  );

  vscode.commands.registerCommand('say-hi', arg1 => {
    console.log('hi from say hi:', arg1);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

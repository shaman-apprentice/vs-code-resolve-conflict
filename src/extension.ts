import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';

export function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      'open-resolve-conflict',
      openResolveConflict(ctx)
    )
  );
}

export function deactivate() {
  // nothing to do
}

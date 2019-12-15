import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';
import { applyResolveConflict } from './commands/apply-resolve-conflict';
import { handleSingleConflict } from './commands/handle-single-conflict';

import {
  ResolveConflictProvider,
  SCHEMA,
} from './virtual-documents/resolve-conflict';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'open-resolve-conflict',
    openResolveConflict
  );
  vscode.commands.registerCommand('apply-resolve-conflict', applyResolveConflict);
  vscode.commands.registerCommand('handle-single-conflict', handleSingleConflict);

  vscode.workspace.registerTextDocumentContentProvider(
    SCHEMA,
    new ResolveConflictProvider()
  );

  context.subscriptions.push(disposable); // todo what exactly is this?
}

export function deactivate() {
  console.log('hi from deactivating');
}

import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';
import { applyResolveConflict } from './commands/apply-resolve-conflict';
import { handleSingleConflict } from './commands/handle-single-conflict';

import {
  ResolveConflictProvider,
  SCHEMA,
} from './virtual-documents/resolve-conflict';
import { StateManager } from './controller/state-manager';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('open-resolve-conflict', openResolveConflict),
    vscode.commands.registerCommand('apply-resolve-conflict', applyResolveConflict),
    vscode.commands.registerCommand('handle-single-conflict', handleSingleConflict),

    vscode.workspace.registerTextDocumentContentProvider(
      SCHEMA,
      new ResolveConflictProvider()
    ),

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
      e.document.uri.scheme === SCHEMA && StateManager.applyDecorations();
    })
  );
}

export function deactivate() {
  // nothing to do
}

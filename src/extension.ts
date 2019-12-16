import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';
import { applyResolveConflict } from './commands/apply-resolve-conflict';
import { handleSingleConflict } from './commands/handle-single-conflict';

import { VersionProvider } from './virtual-documents/version-provider';
import { MergeResultProvider } from './virtual-documents/merge-result-provider';
import { StateManager } from './controller/state-manager';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('open-resolve-conflict', openResolveConflict),
    vscode.commands.registerCommand('apply-resolve-conflict', applyResolveConflict),
    vscode.commands.registerCommand('handle-single-conflict', handleSingleConflict),

    vscode.workspace.registerTextDocumentContentProvider(
      VersionProvider.schema,
      new VersionProvider()
    ),
    vscode.workspace.registerFileSystemProvider(
      MergeResultProvider.schema,
      new MergeResultProvider()
    ),

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
      console.log('hi from did change');
      console.log(e.document.uri);
      // todo handle decorations of versions and merge result
      if (e.document.uri.scheme === VersionProvider.schema)
        StateManager.applyDecorations();
    })
  );
}

export function deactivate() {
  // nothing to do
}

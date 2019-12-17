import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';
import { handleSingleConflict } from './commands/handle-single-conflict';
import { applyResolveConflict } from './commands/apply-resolve-conflict';
import { cancelResolveConflict } from './commands/cancel-resolve-conflict';

import { VersionProvider } from './virtual-documents/version-provider';
import { MergeResultProvider } from './virtual-documents/merge-result-provider';
import { StateManager } from './controller/state-manager';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('open-resolve-conflict', openResolveConflict),
    vscode.commands.registerCommand('handle-single-conflict', handleSingleConflict),
    vscode.commands.registerCommand('apply-resolve-conflict', applyResolveConflict),
    vscode.commands.registerCommand(
      'cancel-resolve-conflict',
      cancelResolveConflict
    ),

    vscode.workspace.registerTextDocumentContentProvider(
      VersionProvider.scheme,
      new VersionProvider()
    ),
    vscode.workspace.registerFileSystemProvider(
      MergeResultProvider.scheme,
      new MergeResultProvider()
    ),

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
      const scheme = e.document.uri.scheme;

      if (scheme === MergeResultProvider.scheme) {
        e.contentChanges.forEach(cC => {
          // start := .line, .character
          console.log(cC.range.start, cC.range.end, cC.text);
        });
      }

      if (scheme === VersionProvider.scheme || scheme === MergeResultProvider.scheme)
        StateManager.applyDecorations();
    })
  );
}

export function deactivate() {
  // nothing to do
}

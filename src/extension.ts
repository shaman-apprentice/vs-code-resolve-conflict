import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';
import { handleSingleConflict } from './commands/handle-single-conflict';
import { applyResolveConflict } from './commands/apply-resolve-conflict';
import { cancelResolveConflict } from './commands/cancel-resolve-conflict';

import { VersionProvider } from './virtual-documents/version-provider';
import { MergeResultProvider } from './virtual-documents/merge-result-provider';
import { StateManager } from './controller/state-manager';
import { updateMergeResultContent } from './controller/editors/editors-utilities';

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

    vscode.workspace.onDidChangeTextDocument(event => {
      const scheme = event.document.uri.scheme;
      const byEditor = (event as any).byEditor;
      console.log('byEditor', byEditor, event.document.uri.query);
      if (scheme === MergeResultProvider.scheme)
        event.contentChanges.forEach(changeEvent => {
          updateMergeResultContent(
            changeEvent,
            StateManager.data.mergeResult.lines,
            StateManager.data.localChanges.lines,
            StateManager.data.remoteChanges.lines
          );
        });

      if (scheme === VersionProvider.scheme || scheme === MergeResultProvider.scheme)
        StateManager.applyDecorations();
    })
  );
}

export function deactivate() {
  // nothing to do
}

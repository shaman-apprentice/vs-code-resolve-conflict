import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict.command';

import {
  LOCAL_CHANGES_SCHEME,
  LocalChangesProvider,
} from './virtual-documents/local-changes';
import {
  MERGE_RESULT_SCHEME,
  MergeResultProvider,
} from './virtual-documents/merge-result';
import {
  REMOTE_CHANGES_SCHEME,
  RemoteChangesProvider,
} from './virtual-documents/remote-changes';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'open-resolve-conflict',
    openResolveConflict
  );

  vscode.workspace.registerTextDocumentContentProvider(
    LOCAL_CHANGES_SCHEME,
    new LocalChangesProvider()
  );
  vscode.workspace.registerTextDocumentContentProvider(
    MERGE_RESULT_SCHEME,
    new MergeResultProvider()
  );
  vscode.workspace.registerTextDocumentContentProvider(
    REMOTE_CHANGES_SCHEME,
    new RemoteChangesProvider()
  );

  context.subscriptions.push(disposable); // todo what exactly is this?
}

export function deactivate() {
  console.log('hi from deactivating');
}

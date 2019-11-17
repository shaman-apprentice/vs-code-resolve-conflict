import * as vscode from 'vscode';

import { openResolveConflict } from './commands/open-resolve-conflict';
import { openLocalChanges } from './commands/open-local-changes';

import {
  LOCAL_CHANGES_SCHEME,
  LocalChangesProvider,
} from './virtual-documents/local-changes';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'open-resolve-conflict',
    openResolveConflict
  );
  vscode.commands.registerCommand('open-local-changes', openLocalChanges);

  vscode.workspace.registerTextDocumentContentProvider(
    LOCAL_CHANGES_SCHEME,
    new LocalChangesProvider()
  );

  context.subscriptions.push(disposable); // todo what exactly is this?
}

export function deactivate() {
  console.log('hi from deactivating');
}

import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';

export const applyResolveConflict = (ctx: any) =>
  StateManager.gitConflict.localChanges.length === 0 &&
  StateManager.gitConflict.remoteChanges.length === 0
    ? StateManager.save()
    : vscode.window.showErrorMessage('Some conflicts are still on fire');

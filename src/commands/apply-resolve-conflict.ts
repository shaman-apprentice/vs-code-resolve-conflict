import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';

export const applyResolveConflict = (ctx: any) => {
  vscode.window.showErrorMessage('Some conflicts are still on fire');
  // todo probably something like:
  // const conflicts = [
  //   ...StateManager.parsedConflict.localChanges,
  //   ...StateManager.parsedConflict.remoteChanges,
  // ].filter(c => c.wasAdded);
  // conflicts.length
  //   ? StateManager.save()
  //   : vscode.window.showErrorMessage('Some conflicts are still on fire');
};

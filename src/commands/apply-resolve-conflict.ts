import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';

export const applyResolveConflict = (ctx: any) => {
  const nonResolvedConflicts = [
    ...StateManager.data.localChanges.conflicts,
    ...StateManager.data.remoteChanges.conflicts,
  ].filter(c => !c.isResolved);

  if (nonResolvedConflicts.length) {
    vscode.window.showErrorMessage('Some conflicts are still on fire');
    return;
  }

  return StateManager.save();
};

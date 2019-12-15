import * as vscode from 'vscode';

import { open as openEditors, close as closeEditors } from './editors/editors';
import { init as initConflict } from './conflict/analyzer';
import { IConflict } from './conflict/conflict.interface';
import { applyDecoration } from './editors/decoration';

export class StateManager {
  public static editors: any;
  public static conflict: IConflict;

  public static async init(filePath: string) {
    StateManager.conflict = await initConflict(filePath);
    StateManager.editors = await openEditors();
    StateManager.applyDecorations();
  }

  public static applyDecorations() {
    applyDecoration(
      StateManager.editors.localChanges,
      StateManager.conflict.localChanges
    );
  }

  public static async save() {
    // todo save first
    await StateManager.close();
  }

  public static async close() {
    await closeEditors([
      StateManager.editors.localChanges,
      StateManager.editors.mergeResult,
      StateManager.editors.serverChanges,
    ]);
  }
}

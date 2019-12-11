import { open as openEditors, close as closeEditors } from './editors';
import { analyzeConflict } from './conflict-analyzer';

export class StateManager {
  private static editors: any;
  public static conflict: any;

  public static async init(filePath: string) {
    StateManager.conflict = await analyzeConflict(filePath);
    StateManager.editors = await openEditors();
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

import { open as openEditors, close as closeEditors } from './editors';

export class StateManager {
  private static instance: StateManager;
  private static editors: any;

  private constructor() {}

  public static async init(filePath: string) {
    StateManager.instance = StateManager.instance || new StateManager();

    // const content = await fs.readFile(fsPath, { encoding: 'utf-8' });

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

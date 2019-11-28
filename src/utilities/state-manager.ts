import { open as openEditors, close as closeEditors } from './editors';
import { getCommonAncestor } from './git';

export class StateManager {
  private static instance: StateManager;
  private static editors: any;
  public static conflict: any;

  private constructor() {}

  public static async init(filePath: string) {
    StateManager.instance = StateManager.instance || new StateManager();

    StateManager.conflict = {
      localChanges: 'hi from local',
      mereResult: await getCommonAncestor(filePath),
      remoteChanges: 'hi from remote',
    };
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

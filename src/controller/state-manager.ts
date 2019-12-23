import { open as openEditors, close as closeEditors } from './editors/editors';
import { parseGitConflict } from './git/parser';
import { applyDecoration } from './editors/decoration';
import { IGitConflict } from '../model/git-conflict';
import { IEditors } from '../model/editors';
import { IMergeResultLine } from '../model/line';

export class StateManager {
  public static gitConflict: IGitConflict;
  public static editors: IEditors;
  public static manualAddedLines: [];
  public static mergeResult: IMergeResultLine[];

  public static async init(fsPath: string) {
    StateManager.gitConflict = await parseGitConflict(fsPath);
    StateManager.editors = await openEditors(fsPath);
    StateManager.manualAddedLines = [];
    StateManager.mergeResult = [];
  }

  public static applyDecorations() {
    applyDecoration(
      StateManager.editors.localChanges,
      StateManager.gitConflict.localChanges
    );
  }

  public static async save() {
    // todo save first and `git add thisFile`
    await StateManager.close();
  }

  public static close() {
    return closeEditors([
      StateManager.editors.localChanges,
      StateManager.editors.mergeResult,
      StateManager.editors.remoteChanges,
    ]);
  }
}

import { open as openEditors, close as closeEditors } from './editors/editors';
import { parseGitConflict } from './git/parser';
import {
  applyVersionDecoration,
  applyMergeResultDecoration,
} from './editors/decoration';
import { IEditors } from '../model/editors';
import { parseInitialConflict } from './content-parser/content-parser';
import { IParsedConflict } from '../model/parsed-conflict';

export class StateManager {
  public static parsedConflict: IParsedConflict;
  public static editors: IEditors;

  public static async init(fsPath: string) {
    const gitConflict = await parseGitConflict(fsPath);
    StateManager.parsedConflict = parseInitialConflict(gitConflict);
    StateManager.editors = await openEditors(fsPath);
  }

  public static applyDecorations() {
    applyVersionDecoration(
      StateManager.editors.localChanges,
      StateManager.parsedConflict.localChanges
    );
    applyMergeResultDecoration(
      StateManager.editors.mergeResult,
      StateManager.parsedConflict.mergeResult
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

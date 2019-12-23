import { open as openEditors, close as closeEditors } from './editors/editors';
import { parseGitConflict } from './git/parser';
import {
  applyVersionDecoration,
  applyMergeResultDecoration,
} from './editors/decoration';
import { IGitConflict } from '../model/git-conflict';
import { IEditors } from '../model/editors';
import { IMergeResultLine, IVersionLine } from '../model/line';
import { getLocalChanges } from './editors/content';

export class StateManager {
  public static gitConflict: IGitConflict;
  public static editors: IEditors;
  public static parsedConflict: any; // todo

  public static async init(fsPath: string) {
    StateManager.gitConflict = await parseGitConflict(fsPath);
    let mergeResult = StateManager.gitConflict.commonAncestor.map(
      (line: string) => ({
        content: [line],
        paddingBottom: 0,
        wasManualAdded: false,
        wasRemoved: false,
      })
    );

    let localChanges = getLocalChanges(
      StateManager.gitConflict.commonAncestor,
      StateManager.gitConflict.localChanges,
      mergeResult
    );

    StateManager.parsedConflict = {
      localChanges,
      mergeResult,
      remoteChanges: [] as IVersionLine[],
      manualAddedLines: [],
    };

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

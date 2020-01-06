import {
  open as openEditors,
  close as closeEditors,
} from './editors/editors-utilities';
import { parseGitConflict } from './git/git-parser';
import { IEditors, IData } from '../model/editors';
import {
  parseInitialMergeResult,
  parseLocalChanges,
  parseRemoteChanges,
} from './editors/git-conflict-to-editor-lines';
import {
  getAddedDecorations,
  getRemovedDecorations,
} from './editors/decoration-helper';
import { VersionType } from '../model/git-conflict';
import { added as addedDecoration } from '../text-editor-decoration/added';
import { removed as removedDecoration } from '../text-editor-decoration/removed';

export class StateManager {
  public static data: IData;
  public static editors: IEditors;

  public static async init(fsPath: string) {
    const gitConflict = await parseGitConflict(fsPath);

    let mergeResultLines = parseInitialMergeResult(gitConflict.commonAncestor);
    let localChangesLines = parseLocalChanges(
      gitConflict.localChanges,
      gitConflict.commonAncestor,
      mergeResultLines
    );
    const remoteChangesLines = parseRemoteChanges(
      gitConflict.remoteChanges,
      gitConflict.commonAncestor,
      mergeResultLines,
      localChangesLines
    );
    StateManager.data = {
      localChanges: {
        lines: localChangesLines,
        conflicts: gitConflict.localChanges,
      },
      mergeResult: {
        lines: mergeResultLines,
      },
      remoteChanges: {
        lines: remoteChangesLines,
        conflicts: gitConflict.remoteChanges,
      },
    };

    StateManager.editors = await openEditors(fsPath);

    StateManager.applyDecorations();
  }

  public static applyDecorations() {
    StateManager.editors.localChanges.setDecorations(
      addedDecoration,
      getAddedDecorations(
        VersionType.local,
        StateManager.data.localChanges.lines,
        StateManager.data.localChanges.conflicts
      )
    );
    StateManager.editors.mergeResult.setDecorations(
      removedDecoration,
      getRemovedDecorations(StateManager.data.mergeResult.lines)
    );
    StateManager.editors.remoteChanges.setDecorations(
      addedDecoration,
      getAddedDecorations(
        VersionType.remote,
        StateManager.data.remoteChanges.lines,
        StateManager.data.remoteChanges.conflicts
      )
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

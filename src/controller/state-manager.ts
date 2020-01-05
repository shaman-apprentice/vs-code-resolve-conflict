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
import { getAddedDecorations } from './editors/decoration-helper';
import { VersionType } from '../model/git-conflict';
import { added as addedDecoration } from '../text-editor-decoration/added';

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
        addedDecorations: getAddedDecorations(
          VersionType.local,
          localChangesLines,
          gitConflict.localChanges
        ),
      },
      mergeResult: {
        lines: mergeResultLines,
        removedDecorations: [], // todo
      },
      remoteChanges: {
        lines: remoteChangesLines,
        conflicts: gitConflict.remoteChanges,
        addedDecorations: getAddedDecorations(
          VersionType.remote,
          remoteChangesLines,
          gitConflict.remoteChanges
        ),
      },
    };

    StateManager.editors = await openEditors(fsPath);

    StateManager.applyDecorations();
  }

  public static applyDecorations() {
    StateManager.editors.localChanges.setDecorations(
      addedDecoration,
      StateManager.data.localChanges.addedDecorations
    );
    StateManager.editors.remoteChanges.setDecorations(
      addedDecoration,
      StateManager.data.remoteChanges.addedDecorations
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

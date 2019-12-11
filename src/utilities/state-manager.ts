import * as vscode from 'vscode';

import { removed } from '../text-editor-decoration/removed';
import { added } from '../text-editor-decoration/added';
import { open as openEditors, close as closeEditors } from './editors';
import { analyzeConflict } from './conflict-analyzer';
import { ILine } from './conflict.interface';

export class StateManager {
  private static editors: any;
  public static conflict: any;

  public static async init(filePath: string) {
    StateManager.conflict = await analyzeConflict(filePath);
    StateManager.editors = await openEditors();
  }

  public static applyDecorations() {
    StateManager.applyDecorationsTo(
      StateManager.editors.localChanges,
      StateManager.conflict.localChanges
    );
    StateManager.applyDecorationsTo(
      StateManager.editors.mergeResult,
      StateManager.conflict.mergeResult
    );
  }

  private static applyDecorationsTo(editor: vscode.TextEditor, conflict: ILine[]) {
    editor.setDecorations(
      removed,
      reduceToRange(conflict, (line: ILine) => line.wasRemoved)
    );
    editor.setDecorations(
      added,
      reduceToRange(conflict, (line: ILine) => line.wasAdded)
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

const reduceToRange = (
  lines: ILine[],
  isTargeted: Function
): vscode.DecorationOptions[] => {
  let start: vscode.Position | null = null;
  return lines.reduce((acc, line, i) => {
    if (!isTargeted(line)) {
      return acc;
    }

    if (!start) {
      start = new vscode.Position(i, 0);
    }

    if (i > lines.length + 1 || !isTargeted(lines[i + 1])) {
      const end = new vscode.Position(i, line.content.length);
      acc.push({
        range: new vscode.Range(start, end),
        hoverMessage: ['1', '2'],
      });

      start = null;
    }

    return acc;
  }, [] as vscode.DecorationOptions[]);
};

import * as vscode from 'vscode';
import { ILocalConflict } from '../conflict/conflict.interface';
import { removed as removedDecoration } from '../../text-editor-decoration/removed';
import { added as addedDecoration } from '../../text-editor-decoration/added';
import { createHover } from '../../text-editor-decoration/hover';

export const applyDecoration = (
  editor: vscode.TextEditor,
  localConflicts: ILocalConflict[]
) => {
  const decorations = calcDecoOpts(localConflicts);
  editor.setDecorations(addedDecoration, decorations.added);
  editor.setDecorations(removedDecoration, decorations.removed);
};

export const calcDecoOpts = (localConflicts: ILocalConflict[]) =>
  localConflicts.reduce(
    (acc: any, lc, i) => {
      if (lc.removedLines.length) {
        const start = lc.startLineRemoved + acc.addedLines;
        const end = start + lc.removedLines.length - 1;
        acc.removed.push(getDecoOpts(start, end, i));
      }

      if (lc.addedLines.length) {
        const start = lc.startLineAdded + lc.removedLines.length + acc.addedLines;
        const end = start + lc.addedLines.length - 1;
        acc.added.push(getDecoOpts(start, end, i));
      }

      acc.addedLines += lc.addedLines.length;
      return acc;
    },
    { removed: [], added: [], addedLines: 0 }
  );

const getDecoOpts = (
  start: number,
  end: number,
  conflictIndex: number
): vscode.DecorationOptions => ({
  range: new vscode.Range(
    new vscode.Position(start, 0),
    new vscode.Position(end, 0)
  ),
  hoverMessage: [
    createHover({
      shouldUse: true,
      type: 'local',
      conflictNumber: conflictIndex,
    }),
    createHover({
      shouldUse: false,
      type: 'local', // todo
      conflictNumber: conflictIndex,
    }),
  ],
});

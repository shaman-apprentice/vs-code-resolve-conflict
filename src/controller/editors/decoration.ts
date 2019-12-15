import * as vscode from 'vscode';
import { ILocalConflict } from '../conflict/conflict.interface';
import { removed as removedDecoration } from '../../text-editor-decoration/removed';
import { added as addedDecoration } from '../../text-editor-decoration/added';
import { use as useHover } from '../../text-editor-decoration/hover';

export const applyDecoration = (editor: vscode.TextEditor, cs: ILocalConflict[]) => {
  // todo consider padding for aligning lines

  const decorations = cs.reduce(
    (acc: any, c, i) => {
      if (c.removedLines.length)
        acc.removed.push(getOpts(c.startLineRemoved, c.removedLines, i));

      if (c.addedLines.length)
        acc.added.push(getOpts(c.startLineAdded, c.addedLines, i));

      return acc;
    },
    { removed: [], added: [] }
  );

  editor.setDecorations(addedDecoration, decorations.added);
  editor.setDecorations(removedDecoration, decorations.removed);
};

const getOpts = (
  start: number,
  lines: any[],
  i: number
): vscode.DecorationOptions => {
  return {
    range: new vscode.Range(
      new vscode.Position(start, 0),
      new vscode.Position(start + lines.length, 0)
    ),
    hoverMessage: [
      useHover({
        shouldUse: true,
        type: 'local',
        conflictNumber: i,
      }),
      useHover({
        shouldUse: false,
        type: 'local',
        conflictNumber: i,
      }),
    ],
  };
};

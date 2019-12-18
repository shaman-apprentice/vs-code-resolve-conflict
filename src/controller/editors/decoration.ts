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
        acc.removed.push(getDecoOpts(start, lc.removedLines, i));
      }

      if (lc.addedLines.length) {
        const start = lc.startLineAdded + lc.removedLines.length + acc.addedLines;
        acc.added.push(getDecoOpts(start, lc.addedLines, i));
      }

      acc.addedLines += lc.addedLines.length;
      return acc;
    },
    { removed: [], added: [], addedLines: 0 }
  );

const getDecoOpts = (
  startLine: number,
  lines: string[],
  conflictIndex: number
): vscode.DecorationOptions => {
  const endLine = startLine + lines.length - 1;
  const endChar = lines[lines.length - 1].length;
  return {
    range: new vscode.Range(
      new vscode.Position(startLine, 0),
      new vscode.Position(endLine, endChar)
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
  };
};

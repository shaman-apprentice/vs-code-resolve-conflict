import * as vscode from 'vscode';
import { ISingleGitConflict } from '../../model/git-conflict';
import { removed as removedDecoration } from '../../text-editor-decoration/removed';
import { added as addedDecoration } from '../../text-editor-decoration/added';
import { createHover } from '../../text-editor-decoration/hover';
import { IVersionLine, IMergeResultLine } from '../../model/line';

export const applyVersionDecoration = (
  editor: vscode.TextEditor,
  localConflicts: IVersionLine[]
) => {
  editor.setDecorations(addedDecoration, calcVersionDecoOpts(localConflicts));
};

export const applyMergeResultDecoration = (
  editor: vscode.TextEditor,
  mergeResult: IMergeResultLine[]
) => {
  editor.setDecorations(removedDecoration, calcMergeResultDecoOpts(mergeResult));
};

export const calcVersionDecoOpts = (localConflicts: IVersionLine[]) =>
  localConflicts.reduce(
    (acc: any, lc) => {
      if (lc.wasAdded) {
        acc.decos.push(getDecoOpts(acc.lineIndex, lc.content, acc.conflictIndex));
        acc.conflictIndex += 1;
      }

      acc.lineIndex += lc.content.length + lc.paddingBottom;
      return acc;
    },
    { decos: [], lineIndex: 0, conflictIndex: 0 }
  ).decos;

export const calcMergeResultDecoOpts = (mergeResult: IMergeResultLine[]) =>
  mergeResult.reduce(
    (acc: any, line) => {
      console.log(line.wasRemoved);
      if (line.wasRemoved) {
        acc.decos.push(
          new vscode.Range(
            new vscode.Position(acc.lineIndex, 0),
            new vscode.Position(
              acc.lineIndex + line.content.length - 1,
              line.content[line.content.length - 1].length
            )
          )
        );
      }

      acc.lineIndex += line.content.length + line.paddingBottom;
      return acc;
    },
    { decos: [], lineIndex: 0 }
  ).decos;

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

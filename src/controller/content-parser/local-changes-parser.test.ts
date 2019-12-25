import { parseLocalChanges } from './local-changes-parser';
import { ISingleGitConflict } from '../../model/git-conflict';
import { mergeResultToText } from './to-text';

describe('content parsing from git merge conflict', () => {
  it('calcs needed padding to mergeResult', () => {
    const commonAncestor = ['0', '1', '2'];
    const mergeResult = commonAncestor.map(getInitialMergeResultLine);
    const localChanges: ISingleGitConflict[] = [
      {
        startRemoved: 1,
        removedLines: ['1'],
        startAdded: 1,
        addedLines: ['1', '1.5'],
      },
    ];

    parseLocalChanges(commonAncestor, localChanges, mergeResult);

    expect(mergeResult[1].paddingBottom).toBe(1);
  });

  it('calcs needed padding to local changes', () => {
    const commonAncestor = ['0', '1', '2'];
    const mergeResult = commonAncestor.map(getInitialMergeResultLine);
    const localChanges: ISingleGitConflict[] = [
      {
        startRemoved: 1,
        removedLines: ['1', '2'],
        startAdded: 1,
        addedLines: ['1-2'],
      },
    ];

    const parsedLocalChanges = parseLocalChanges(
      commonAncestor,
      localChanges,
      mergeResult
    );

    expect(parsedLocalChanges[1].paddingBottom).toBe(1);
  });

  it('adds `wasRemoved` to mergeResult', () => {
    const commonAncestor = ['0', '1', '2'];
    const mergeResult = commonAncestor.map(getInitialMergeResultLine);
    const localChanges: ISingleGitConflict[] = [
      {
        startRemoved: 1,
        removedLines: ['1', '2'],
        startAdded: 1,
        addedLines: ['1-2'],
      },
    ];

    const parsedLocalChanges = parseLocalChanges(
      commonAncestor,
      localChanges,
      mergeResult
    );

    expect(mergeResult[0].wasRemoved).toBe(false);
    expect(mergeResult[1].wasRemoved).toBe(true);
    expect(mergeResult[2].wasRemoved).toBe(true);
  });
});

const getInitialMergeResultLine = (content: string) => ({
  content: [content],
  paddingBottom: 0,
  wasManualAdded: false,
  wasRemoved: false,
});

import { getLocalChanges } from './content';
import { IMergeResultLine } from '../../model/line';
import { ISingleGitConflict } from '../../model/git-conflict';

describe('content parsing from git merge conflict', () => {
  it('adds needed padding to mergeResult', () => {
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

    getLocalChanges(commonAncestor, localChanges, mergeResult);

    expect(mergeResult[1].paddingBottom).toBe(1);
  });

  it('adds needed padding to local changes', () => {
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

    const parsedLocalChanges = getLocalChanges(
      commonAncestor,
      localChanges,
      mergeResult
    );

    expect(parsedLocalChanges[1].paddingBottom).toBe(1);
  });
});

const getInitialMergeResultLine = (content: string) => ({
  content: [content],
  paddingBottom: 0,
  wasManualAdded: false,
  wasRemoved: false,
});

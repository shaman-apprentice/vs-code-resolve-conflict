import { parseRemoteChanges } from './remote-changes-parser';
import { ISingleGitConflict } from '../../model/git-conflict';

describe('parse remote changes from git merge conflict', () => {
  it('adds needed padding to merge result', () => {
    const commonAncestor = ['0', '1', '2'];
    const mergeResult = commonAncestor.map(getInitialMergeResultLine);
    const parsedLocalChanges = commonAncestor.map(getInitialLocalChanges);
    const remoteConflict: ISingleGitConflict[] = [
      {
        startRemoved: 1,
        removedLines: ['1'],
        startAdded: 1,
        addedLines: ['1', '1.5'],
      },
    ];

    const parsedRemoteChanges = parseRemoteChanges(
      commonAncestor,
      remoteConflict,
      mergeResult,
      parsedLocalChanges
    );

    expect(mergeResult[1].paddingBottom).toBe(1);
  });

  it('adds needed padding to merge result and local changes', () => {
    const commonAncestor = ['0', '1', '2'];
    const parsedLocalChanges = commonAncestor.map(getInitialLocalChanges);
    parsedLocalChanges[0].wasAdded = true;
    parsedLocalChanges[0].content = ['0', '0.5'];
    const mergeResult = commonAncestor.map(getInitialMergeResultLine);
    mergeResult[0].wasRemoved = true;
    mergeResult[0].paddingBottom = 1;
    const remoteConflict: ISingleGitConflict[] = [
      {
        startRemoved: 1,
        removedLines: ['1'],
        startAdded: 1,
        addedLines: ['1', '1.5'],
      },
    ];

    const parsedRemoteChanges = parseRemoteChanges(
      commonAncestor,
      remoteConflict,
      mergeResult,
      parsedLocalChanges
    );

    expect(mergeResult[1].paddingBottom).toBe(1);
    expect(parsedLocalChanges[0].paddingBottom).toBe(0);
    expect(parsedLocalChanges[1].paddingBottom).toBe(1);
  });
});

const getInitialMergeResultLine = (content: string) => ({
  content: [content],
  paddingBottom: 0,
  wasManualAdded: false,
  wasRemoved: false,
});

const getInitialLocalChanges = (content: string) => ({
  content: [content],
  paddingBottom: 0,
  wasAdded: false,
});

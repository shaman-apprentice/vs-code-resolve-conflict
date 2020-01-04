import {
  parseGitChangesToLines,
  getInitialMergeResult,
} from './git-conflict-to-editor-lines';

describe('`parseGitChanges`', () => {
  it('parses the correct text content of lines', () => {
    const commonAncestor = ['1', '2', '3'];
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['2', '2.5'],
      },
    ];
    const mergeResult = getInitialMergeResult(commonAncestor.join('\n'));

    const lines = parseGitChangesToLines(
      'local',
      changes,
      commonAncestor,
      mergeResult
    );
    expect(lines.length).toBe(4);
    expect(lines[0]).toEqual({ content: '1', wasAdded: false });
    expect(lines[1]).toEqual({ content: '2', wasAdded: true });
    expect(lines[2]).toEqual({ content: '2.5', wasAdded: true });
    expect(lines[3]).toEqual({ content: '3', wasAdded: false });
  });

  it('adds `removedFlagged`', () => {
    const commonAncestor = ['1', '2', '3'];
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['2', '2.5'],
      },
    ];
    const mergeResult = getInitialMergeResult(commonAncestor.join('\n'));

    parseGitChangesToLines('local', changes, commonAncestor, mergeResult);

    expect(mergeResult[1].wasRemoved).toBe(true);
  });

  it('handles alignment of lines with MORE added than removed lines', () => {
    const commonAncestor = ['1', '2', '3'];
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['2', '2.5'],
      },
    ];
    const mergeResult = getInitialMergeResult(commonAncestor.join('\n'));

    parseGitChangesToLines('local', changes, commonAncestor, mergeResult);

    expect(mergeResult.length).toBe(4);
  });

  it('handles alignment of lines with LESS added than removed lines', () => {
    const commonAncestor = ['1', '2', '3'];
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2', '3'],
        startAdded: 1,
        addedLines: ['2 and 3'],
      },
    ];
    const mergeResult = getInitialMergeResult(commonAncestor.join('\n'));

    const lines = parseGitChangesToLines(
      'local',
      changes,
      commonAncestor,
      mergeResult
    );

    expect(lines.length).toBe(2);
    expect(mergeResult[2].isLocalLine).toBe(false);
  });

  it.skip('differentiates between "local" and "remote"', () => {});
});

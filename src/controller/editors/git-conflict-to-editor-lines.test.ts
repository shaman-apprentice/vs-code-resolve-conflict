import {
  parseLocalChanges,
  parseInitialMergeResult,
  parseRemoteChanges,
} from './git-conflict-to-editor-lines';

describe('`parseLocalChanges`', () => {
  it('parses the correct text content of lines', () => {
    const commonAncestor = ['1', '2', '3'].join('\n');
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['two'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);

    const lines = parseLocalChanges(changes, commonAncestor, mergeResult);
    expect(lines.length).toBe(3);
    expect(lines[0]).toEqual({ content: '1', wasAdded: false });
    expect(lines[1]).toEqual({ content: 'two', wasAdded: true });
    expect(lines[2]).toEqual({ content: '3', wasAdded: false });
  });

  it('marks lines as removed', () => {
    const commonAncestor = ['1', '2', '3'].join('\n');
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['2', '2.5'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);

    parseLocalChanges(changes, commonAncestor, mergeResult);

    expect(mergeResult[0].wasRemovedLocal).toBeFalsy();
    expect(mergeResult[1].wasRemovedLocal).toBe(true);
    expect(mergeResult[2].wasRemovedLocal).toBeFalsy();
  });

  it('handles alignment of lines with MORE added than removed lines', () => {
    const commonAncestor = ['1', '2', '3'].join('\n');
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['2', '2.5'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);

    parseLocalChanges(changes, commonAncestor, mergeResult);

    expect(mergeResult.length).toBe(4);
    expect(mergeResult[2].isAlignmentPadding).toBe(true);
  });

  it('handles alignment of lines with LESS added than removed lines', () => {
    const commonAncestor = ['1', '2', '3'].join('\n');
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2', '3'],
        startAdded: 1,
        addedLines: ['2 and 3'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);

    const lines = parseLocalChanges(changes, commonAncestor, mergeResult);

    expect(lines.length).toBe(3);
    expect(lines[2].isAlignmentPadding).toBe(true);
  });

  it('adjusts lines correctly when having multiple changes with MORE added than removed', () => {
    const commonAncestor = ['1', '2', '3', '4'].join('\n');
    const changes = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['2', '2.5'],
      },
      {
        startRemoved: 3,
        removedLines: ['4'],
        startAdded: 3,
        addedLines: ['4', '4.5'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);

    parseLocalChanges(changes, commonAncestor, mergeResult);
    expect(mergeResult.length).toBe(6);
    const mergeResultTextContent = mergeResult.map(l => l.content).join('\n');
    expect(mergeResultTextContent).toBe('1\n2\n\n3\n4\n');
  });

  it('adjusts lines correctly when having multiple changes with LESS added than removed', () => {
    const commonAncestor = ['1', '2', '3', '4'].join('\n');
    const changes = [
      {
        startRemoved: 0,
        removedLines: ['1', '2'],
        startAdded: 0,
        addedLines: ['1 and 2'],
      },
      {
        startRemoved: 2,
        removedLines: ['3', '4'],
        startAdded: 2,
        addedLines: ['3 and 4'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);

    const localLines = parseLocalChanges(changes, commonAncestor, mergeResult);
    expect(localLines.length).toBe(4);
    // const mergeResultTextContent = mergeResult.map(l => l.content).join('\n');
    // expect(mergeResultTextContent).toBe('1\n2\n\n3\n4\n');
  });
});

describe('`parseRemoteChanges`', () => {
  it('adds remaining padding from merge result', () => {
    const commonAncestor = ['1', '2', '3'].join('\n');
    const localChanges = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['2', '2.5'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);
    const localLines = parseLocalChanges(localChanges, commonAncestor, mergeResult);
    const remoteLines = parseRemoteChanges(
      [],
      commonAncestor,
      mergeResult,
      localLines
    );

    expect(remoteLines.length).toBe(4);
    expect(remoteLines[2].isAlignmentPadding).toBe(true);
    expect(remoteLines[3].isAlignmentPadding).toBeFalsy();
    expect(remoteLines[3].content).toBe('3');
  });

  it('takes padding inserted by local changes into account', () => {
    const commonAncestor = ['1', '2', '3'].join('\n');
    const localChanges = [
      {
        startRemoved: 0,
        removedLines: ['1'],
        startAdded: 0,
        addedLines: ['1', '1.5'],
      },
    ];
    const remoteChanges = [
      {
        startRemoved: 1,
        removedLines: ['2'],
        startAdded: 1,
        addedLines: ['two'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);
    const localLines = parseLocalChanges(localChanges, commonAncestor, mergeResult);
    const remoteLines = parseRemoteChanges(
      remoteChanges,
      commonAncestor,
      mergeResult,
      localLines
    );

    expect(remoteLines.length).toBe(4);
    expect(remoteLines[1].isAlignmentPadding).toBe(true);
    const textContent = remoteLines.map(l => l.content).join('\n');
    expect(textContent).toBe('1\n\ntwo\n3');
  });

  it('updates merge result and local padding', () => {
    const commonAncestor = ['1', '2'].join('\n');
    const localChanges = [
      {
        startRemoved: 0,
        removedLines: ['1'],
        startAdded: 0,
        addedLines: ['one'],
      },
    ];
    const remoteChanges = [
      {
        startRemoved: 0,
        removedLines: ['1'],
        startAdded: 0,
        addedLines: ['1.0', '1.5'],
      },
    ];
    const mergeResult = parseInitialMergeResult(commonAncestor);
    const localLines = parseLocalChanges(localChanges, commonAncestor, mergeResult);
    const remoteLines = parseRemoteChanges(
      remoteChanges,
      commonAncestor,
      mergeResult,
      localLines
    );

    expect(localLines.length).toBe(3);
    expect(localLines[1].isAlignmentPadding).toBe(true);
    const localTextContent = localLines.map(l => l.content).join('\n');
    expect(localTextContent).toBe('one\n\n2');

    expect(mergeResult.length).toBe(3);
    expect(mergeResult[1].isAlignmentPadding).toBe(true);
    const mrTextContent = mergeResult.map(l => l.content).join('\n');
    expect(mrTextContent).toBe('1\n\n2');

    expect(remoteLines.length).toBe(3);
    const remoteTextContent = remoteLines.map(l => l.content).join('\n');
    expect(remoteTextContent).toBe('1.0\n1.5\n2');
  });
});

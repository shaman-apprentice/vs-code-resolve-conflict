import { IChangesLine } from '../../model/line';
import { getAddedDecorations } from './decoration-helper';
import { VersionType, ISingleGitChange } from '../../model/git-conflict';

describe('`getAddedDecorations`', () => {
  it('adds related added decorations', () => {
    const lines: IChangesLine[] = [
      { content: '1' },
      { content: '2', wasAdded: true },
      { content: '3 - hula', wasAdded: true },
      { content: '4' },
    ];
    const conflicts: ISingleGitChange[] = [
      {
        startAdded: 1,
        addedLines: ['2', '3'],
        startRemoved: 1,
        removedLines: [],
      },
    ];

    const decorations = getAddedDecorations(VersionType.local, lines, conflicts);
    expect(decorations.length).toBe(1);
    expect(decorations[0].range.start.line).toBe(1);
    expect(decorations[0].range.end.line).toBe(2);
    expect(decorations[0].range.end.character).toBe(lines[2].content.length);
  });
});

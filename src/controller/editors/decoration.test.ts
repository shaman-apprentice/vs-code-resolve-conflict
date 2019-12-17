import { calcDecoOpts } from './decoration';

describe('calculation of decorations', () => {
  it('calculates correct indexes for decorations', () => {
    const conflicts = [
      {
        startLineRemoved: 2,
        removedLines: ['snd line'],
        startLineAdded: 2,
        addedLines: ['thrd line'],
      },
      {
        startLineRemoved: 4,
        removedLines: ['5th line'],
        startLineAdded: 4,
        addedLines: ['fifth line'],
      },
    ];

    const decorations = calcDecoOpts(conflicts);

    expect(decorations.removed[0].range.start.line).toBe(2);
    expect(decorations.removed[0].range.end.line).toBe(2);
    expect(decorations.added[0].range.start.line).toBe(3);
    expect(decorations.added[0].range.end.line).toBe(3);

    expect(decorations.removed[1].range.start.line).toBe(5);
    expect(decorations.removed[1].range.end.line).toBe(5);
    expect(decorations.added[1].range.start.line).toBe(6);
    expect(decorations.added[1].range.end.line).toBe(6);
  });
});

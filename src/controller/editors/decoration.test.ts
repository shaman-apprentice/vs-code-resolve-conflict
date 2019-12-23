import { calcDecoOpts } from './decoration';
import { IVersionLine } from '../../model/line';

describe('calculation of decorations', () => {
  it('calculates correct indexes for decorations', () => {
    const versionLines: IVersionLine[] = [
      {
        content: ['1'],
        paddingBottom: 0,
        wasAdded: false,
      },
      {
        content: ['2', 'bla'],
        paddingBottom: 1,
        wasAdded: true,
      },
      {
        content: ['4'],
        paddingBottom: 0,
        wasAdded: false,
      },
    ];

    const decorations = calcDecoOpts(versionLines);

    expect(decorations.length).toBe(1);
    expect(decorations[0].range.start.line).toBe(1);
    expect(decorations[0].range.end.line).toBe(2);
    expect(decorations[0].range.end.character).toBe(3);
  });
});

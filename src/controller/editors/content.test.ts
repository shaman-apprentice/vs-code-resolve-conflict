import { getTextContent } from './content';

describe('text content deriving', () => {
  it('builds text content without empty conflict', () => {
    const commonAncestor = ['1', '2', '3'];
    expect(getTextContent(commonAncestor, [])).toBe('1\n2\n3');
  });

  it('builds text content with conflict', () => {
    const commonAncestor = ['1', '2', '3'];
    const localConflict = {
      startLineRemoved: 1,
      removedLines: ['2'],
      startLineAdded: 1,
      addedLines: ['2!', '2.5'],
    };
    expect(getTextContent(commonAncestor, [localConflict])).toBe('1\n2\n2!\n2.5\n3');
  });
});

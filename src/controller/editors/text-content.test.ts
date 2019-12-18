import { getLocalChanges } from './content';

describe('text content deriving', () => {
  // it('builds text content without empty conflict', () => {
  //   const commonAncestor = ['1', '2', '3'];
  //   expect(getLocalChanges(commonAncestor, [])).toBe('1\n2\n3');
  // });
  // it('builds text content with conflict', () => {
  //   const commonAncestor = ['1', '2', '3'];
  //   const localConflict = {
  //     startRemoved: 1,
  //     removedLines: ['2'],
  //     startAdded: 1,
  //     addedLines: ['2!', '2.5'],
  //   };
  //   expect(getLocalChanges(commonAncestor, [localConflict])).toBe(
  //     '1\n2\n2!\n2.5\n3'
  //   );
  // });
});

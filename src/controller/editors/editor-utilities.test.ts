import { replaceSubStr, updateMergeResult } from './editors-utilities';

describe('`replaceSubStr`', () => {
  it('replaces ONE cars in the middle', () => {
    const result = replaceSubStr('123', 1, 2, 'two');
    expect(result).toBe('1two3');
  });

  it('replaces MULTIPLE chars in the middle', () => {
    const result = replaceSubStr('01223', 2, 4, 'twenty-two');
    expect(result).toBe('01twenty-two3');
  });
});

describe('`updateMergeResult`', () => {
  it('works with only one changed line', () => {
    const mergeResultLines = [{ content: '1223' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 3 },
      },
      text: 'twenty-two',
    };

    updateMergeResult(changeEvent, mergeResultLines);
    expect(mergeResultLines[0].content).toBe('1twenty-two3');
  });

  it.skip('works with entering a new line', () => {});
  it.skip('works with entering a new line within conflict', () => {});
  it.skip('works with adding multiple lines in between', () => {});
});

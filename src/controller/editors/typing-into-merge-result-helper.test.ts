import {
  replaceSubStr,
  getFstLineContent,
  getLastLineContent,
} from './typing-into-merge-result-helper';

describe('`replaceSubStr`', () => {
  it('replaces ONE chars in the middle', () => {
    const result = replaceSubStr('123', 1, 2, 'two');
    expect(result).toBe('1two3');
  });

  it('replaces MULTIPLE chars in the middle', () => {
    const result = replaceSubStr('01223', 2, 4, 'twenty-two');
    expect(result).toBe('01twenty-two3');
  });
});

describe('`getFstLineContent`', () => {
  it('replaces only substring, when first line === last line and only one line is entered', () => {
    const lines = [{ content: '1223' }];
    const content = getFstLineContent(lines, ['twenty-two'], 0, 1, 0, 3);
    expect(content).toBe('1twenty-two3');
  });

  it('replaces until the end, when first line !== last line', () => {
    const lines = [{ content: '1223' }, { content: 'another line' }];
    const content = getFstLineContent(lines, ['twenty-two'], 0, 1, 1, 3);
    expect(content).toBe('1twenty-two');
  });

  it('replaces until the end when multiple lines are entered', () => {
    const lines = [{ content: '1223' }];
    const content = getFstLineContent(lines, ['twenty-two', 'foo'], 0, 1, 0, 3);
    expect(content).toBe('1twenty-two');
  });
});

describe('`getLastLineContent`', () => {
  it('gets the content of the last line', () => {
    const lines = [{ content: '1223' }];
    const content = getLastLineContent(lines, ['twenty-two', 'another line '], 0, 3);
    expect(content).toBe('another line 3');
  });
});

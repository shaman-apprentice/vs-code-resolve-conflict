import * as vscode from 'vscode';

import { updateMergeResultContent } from './editors-utilities';

describe('`updateMergeResult`', () => {
  it('works with only one changed line', () => {
    const mergeResultLines = [{ content: '1223' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 3 },
      },
      text: 'twenty-two',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mergeResultLines);
    expect(mergeResultLines[0].content).toBe('1twenty-two3');
  });

  it('works with entering a new line at the end of a line', () => {
    const mergeResultLines = [{ content: '1' }, { content: '2' }];
    const localLines = [{ content: '1.0' }, { content: '2.0' }];
    const remoteLines = [{ content: 'one' }, { content: 'two' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 1 },
      },
      text: '\n',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mergeResultLines);

    expect(mergeResultLines.length).toBe(3);
    expect(mergeResultLines[0].content).toBe('1');
    expect(mergeResultLines[1].content).toBe('');
    expect(mergeResultLines[2].content).toBe('2');
  });

  it.skip('works with entering a new line in the middle of a line', () => {});

  it.skip('works with entering a new line within conflict', () => {});

  it.skip('works with adding multiple lines in between', () => {});
});

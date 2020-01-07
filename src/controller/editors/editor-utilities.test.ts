import * as vscode from 'vscode';

import { updateMergeResultContent } from './editors-utilities';

describe('`updateMergeResult`', () => {
  it('works with only one changed line', () => {
    const mrLines = [{ content: '1223' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 3 },
      },
      text: 'twenty-two',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines);
    expect(mrLines[0].content).toBe('1twenty-two3');
  });

  it('works with entering a new line AT THE END of a line', () => {
    const mrLines = [{ content: '1' }, { content: '2' }];
    const localLines = [{ content: '1.0' }, { content: '2.0' }];
    const remoteLines = [{ content: 'one' }, { content: 'two' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 1 },
      },
      text: '\n',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines);

    expect(mrLines.length).toBe(3);
    expect(mrLines[0].content).toBe('1');
    expect(mrLines[1].content).toBe('');
    expect(mrLines[2].content).toBe('2');
  });

  it('merge result content works with entering a new line IN THE MIDDLE of a line', () => {
    const mrLines = [{ content: 'zero one' }, { content: 'two' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 4 },
        end: { line: 0, character: 5 },
      },
      text: '\n',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines);

    expect(mrLines.length).toBe(3);
    expect(mrLines[0].content).toBe('zero');
    expect(mrLines[1].content).toBe('one');
    expect(mrLines[2].content).toBe('two');
  });

  it.skip('works with entering a new line within conflict', () => {});

  it.skip('works with adding multiple lines in between', () => {});
});

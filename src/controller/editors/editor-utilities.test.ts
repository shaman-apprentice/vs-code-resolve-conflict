import * as vscode from 'vscode';

import { StateManager } from '../state-manager';
import { IChangesLine, IMergeResultLine } from '../../model/line';
import { updateMergeResultContent } from './editors-utilities';
import { MergeResultProvider } from '../../virtual-documents/merge-result-provider';

const originalApplyDecorations = StateManager.applyDecorations;
const originalFireUpdateContent = MergeResultProvider.fireUpdateContent;

beforeEach(() => {
  StateManager.applyDecorations = jest.fn();
  MergeResultProvider.fireUpdateContent = jest.fn();
});

afterAll(() => {
  StateManager.applyDecorations = originalApplyDecorations;
  MergeResultProvider.fireUpdateContent = originalFireUpdateContent;
});

describe('`updateMergeResult`', () => {
  it('works with only one changed line', () => {
    const mrLines = [{ content: '1223' }];
    const localLines = [{ content: '1' }] as IChangesLine[];
    const remoteLines = [{ content: '1.0' }] as IChangesLine[];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 3 },
      },
      text: 'twenty-two',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(mrLines[0].content).toBe('1twenty-two3');
  });

  it('merge result content works with entering a new line AT THE END of a line', () => {
    const mrLines = [{ content: '1' }, { content: '2' }];
    const localLines = [{ content: '1' }, { content: '2' }] as IChangesLine[];
    const remoteLines = [{ content: '1.0' }, { content: '2' }] as IChangesLine[];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 1 },
      },
      text: '\n',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(mrLines.length).toBe(3);
    expect(mrLines[0].content).toBe('1');
    expect(mrLines[1].content).toBe('');
    expect(mrLines[2].content).toBe('2');
  });

  it('merge result content works with entering a new line IN THE MIDDLE of a line', () => {
    const mrLines = [{ content: 'zero one' }, { content: 'two' }];
    const localLines = [{ content: '1' }, { content: 'two' }] as IChangesLine[];
    const remoteLines = [{ content: '1.0' }, { content: 'two' }] as IChangesLine[];

    const changeEvent = {
      range: {
        start: { line: 0, character: 4 },
        end: { line: 0, character: 5 },
      },
      text: '\n',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(mrLines.length).toBe(3);
    expect(mrLines[0].content).toBe('zero');
    expect(mrLines[1].content).toBe('one');
    expect(mrLines[2].content).toBe('two');
  });

  it('updates local padding if needed (when NOT in conflict)', () => {
    const mrLines = [{ content: 'one' }, { content: 'two' }];
    const localLines = [
      { content: '1', wasAdded: true },
      { content: 'two' },
    ] as IChangesLine[];
    const remoteLines = [
      { content: '1.0', wasAdded: true },
      { content: 'two' },
    ] as IChangesLine[];

    const changeEvent = {
      range: {
        start: { line: 0, character: 3 },
        end: { line: 0, character: 4 },
      },
      text: '\nfoo',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(mrLines.length).toBe(3);

    expect(localLines.length).toBe(3);
    expect(localLines[0].content).toBe('1');
    expect(localLines[0].isAlignmentPadding).toBe(undefined);
    expect(localLines[0].wasAdded).toBe(true);
    expect(localLines[1].content).toBe('');
    expect(localLines[1].isAlignmentPadding).toBe(true);
    expect(localLines[1].wasAdded).toBe(false);
    expect(localLines[2].content).toBe('two');
    expect(localLines[2].isAlignmentPadding).toBe(undefined);
    expect(localLines[2].wasAdded).toBe(undefined);
  });

  it('updates local padding if needed (when in conflict)', () => {
    const mrLines = [{ content: 'zero one' }, { content: 'two' }];
    const localLines = [
      { content: '1', wasAdded: true },
      { content: 'two' },
    ] as IChangesLine[];
    const remoteLines = [{ content: '1.0', wasAdded: true }, { content: 'two' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 4 },
        end: { line: 0, character: 5 },
      },
      text: '\nfoo',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(mrLines.length).toBe(3);

    expect(localLines.length).toBe(3);
    expect(localLines[0].content).toBe('1');
    expect(localLines[0].isAlignmentPadding).toBe(undefined);
    expect(localLines[0].wasAdded).toBe(true);
    expect(localLines[1].content).toBe('');
    expect(localLines[1].isAlignmentPadding).toBe(true);
    expect(localLines[1].wasAdded).toBe(true);
    expect(localLines[2].content).toBe('two');
    expect(localLines[2].isAlignmentPadding).toBe(undefined);
    expect(localLines[2].wasAdded).toBe(undefined);
  });

  it('adds padding to merge result if needed', () => {
    const mrLines = [{ content: 'one' }, { content: 'two' }] as IMergeResultLine[];
    const localLines = [{ content: '1', wasAdded: true }, { content: 'two' }];
    const remoteLines = [{ content: '1.0', wasAdded: true }, { content: 'two' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 0 },
        end: { line: 1, character: 3 },
      },
      text: 'only one',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(mrLines.length).toBe(2);
    expect(mrLines[0].content).toBe('only one');
    expect(mrLines[0].isAlignmentPadding).toBe(undefined);
    expect(mrLines[1].content).toBe('');
    expect(mrLines[1].isAlignmentPadding).toBe(true);
  });

  it('merge result content works with ADDING multiple lines', () => {
    const mrLines = [{ content: 'one' }, { content: 'four' }] as IMergeResultLine[];
    const localLines = [{ content: '1', wasAdded: true }, { content: 'two' }];
    const remoteLines = [{ content: '1.0', wasAdded: true }, { content: 'two' }];

    const changeEvent = {
      range: {
        start: { line: 0, character: 3 },
        end: { line: 0, character: 3 },
      },
      text: '\ntwo\nthree',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(mrLines.length).toBe(4);
    expect(mrLines[0].content).toBe('one');
    expect(mrLines[1].content).toBe('two');
    expect(mrLines[2].content).toBe('three');
    expect(mrLines[3].content).toBe('four');
  });

  it('merge result content works with REMOVING multiple lines', () => {
    const mrLines = [
      { content: 'one' },
      { content: 'two' },
      { content: 'three' },
    ] as IMergeResultLine[];
    const localLines = [
      { content: '1', wasAdded: true },
      { content: 'two' },
      { content: 'three' },
    ];
    const remoteLines = [
      { content: '1.0', wasAdded: true },
      { content: 'two' },
      { content: 'three' },
    ];

    const changeEvent = {
      range: {
        start: { line: 0, character: 0 },
        end: { line: 2, character: 0 },
      },
      text: 'one and two',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    mrLines.forEach(l => console.log(l.content));

    expect(mrLines.length).toBe(3);
    expect(mrLines[0].content).toBe('one and two');
    expect(mrLines[1].content).toBe('');
    expect(mrLines[1].isAlignmentPadding).toBe(true);
    expect(mrLines[2].content).toBe('three');
    expect(mrLines[2].isAlignmentPadding).toBe(undefined);
  });

  it('reapplies decorations', () => {
    const mrLines = [{ content: '1223' }];
    const localLines = [{ content: '1' }] as IChangesLine[];
    const remoteLines = [{ content: '1.0' }] as IChangesLine[];

    const changeEvent = {
      range: {
        start: { line: 0, character: 1 },
        end: { line: 0, character: 3 },
      },
      text: 'twenty-two',
    } as vscode.TextDocumentContentChangeEvent;

    updateMergeResultContent(changeEvent, mrLines, localLines, remoteLines);

    expect(StateManager.applyDecorations).toHaveBeenCalled();
  });
});

import { StateManager } from '../controller/state-manager';
import { handleSingleConflict } from './handle-single-conflict';
import { VersionType } from '../model/git-conflict';
import { MergeResultProvider } from '../virtual-documents/merge-result-provider';

let originalApplyDecorations = StateManager.applyDecorations;
let originalFireUpdateContent = MergeResultProvider.fireUpdateContent;

beforeEach(() => {
  StateManager.applyDecorations = jest.fn();
  MergeResultProvider.fireUpdateContent = jest.fn();
});

afterAll(() => {
  StateManager.applyDecorations = originalApplyDecorations;
  MergeResultProvider.fireUpdateContent = originalFireUpdateContent;
});

describe("don't use action", () => {
  it("updates the `StateManager` due to LOCAL don't use", async () => {
    StateManager.data = {
      localChanges: {
        conflicts: [
          {
            startAdded: 1,
            addedLines: ['2.0'],
            startRemoved: 1,
            removedLines: ['1'],
          },
        ],
        lines: [
          { content: '1' },
          { content: '2.0', wasAdded: true },
          { content: '3' },
        ],
      },
      mergeResult: {
        lines: [
          { content: '1' },
          { content: '2', wasRemovedLocal: true },
          { content: '3' },
        ],
      },
      remoteChanges: { conflicts: [], lines: [] }, // don't care about unrealistic data here
    };

    await handleSingleConflict({
      type: VersionType.local,
      conflictIndex: 0,
      shouldUse: false,
      startLine: 1,
      endLine: 1,
    });

    expect(StateManager.data.localChanges.conflicts[0].isResolved).toBe(true);
    expect(StateManager.data.mergeResult.lines[1].wasRemovedLocal).toBe(false);
    expect(StateManager.applyDecorations).toHaveBeenCalled();
    expect(StateManager.data.mergeResult.lines[1].content).toBe('2');
  });

  it("updates the `StateManager` due to REMOTE don't use", async () => {
    StateManager.data = {
      localChanges: { conflicts: [], lines: [] }, // don't care about unrealistic data here
      mergeResult: {
        lines: [
          { content: '1' },
          { content: '2', wasRemovedRemote: true },
          { content: '3' },
        ],
      },
      remoteChanges: {
        conflicts: [
          {
            startAdded: 1,
            addedLines: ['2.0'],
            startRemoved: 1,
            removedLines: ['1'],
          },
        ],
        lines: [
          { content: '1' },
          { content: '2.0', wasAdded: true },
          { content: '3' },
        ],
      },
    };

    await handleSingleConflict({
      type: VersionType.remote,
      conflictIndex: 0,
      shouldUse: false,
      startLine: 1,
      endLine: 1,
    });

    expect(StateManager.data.remoteChanges.conflicts[0].isResolved).toBe(true);
    expect(StateManager.data.mergeResult.lines[1].wasRemovedRemote).toBe(false);
    expect(StateManager.applyDecorations).toHaveBeenCalled();
    expect(StateManager.data.mergeResult.lines[1].content).toBe('2');
  });
});

describe('use action', () => {
  it('uses local change', async () => {
    StateManager.data = {
      localChanges: {
        conflicts: [
          {
            startAdded: 1,
            addedLines: ['2.0'],
            startRemoved: 1,
            removedLines: ['1'],
          },
        ],
        lines: [
          { content: '1' },
          { content: '2.0', wasAdded: true },
          { content: '2.5', wasAdded: true },
          { content: '3' },
        ],
      },
      mergeResult: {
        lines: [
          { content: '1' },
          { content: '2', wasRemovedLocal: true },
          { content: '', isAlignmentPadding: true },
          { content: '3' },
        ],
      },
      remoteChanges: { conflicts: [], lines: [] }, // don't care about unrealistic data here
    };

    await handleSingleConflict({
      type: VersionType.local,
      conflictIndex: 0,
      shouldUse: true,
      startLine: 1,
      endLine: 2,
    });

    expect(StateManager.data.localChanges.conflicts[0].isResolved).toBe(true);
    expect(StateManager.data.mergeResult.lines[1].wasRemovedLocal).toBe(false);
    expect(StateManager.data.mergeResult.lines[1].content).toBe('2.0');
    expect(StateManager.data.mergeResult.lines[2].wasRemovedLocal).toBe(false);
    expect(StateManager.data.mergeResult.lines[2].content).toBe('2.5');
    expect(StateManager.data.mergeResult.lines[2].isAlignmentPadding).toBe(
      undefined
    );
    expect(StateManager.applyDecorations).toHaveBeenCalled();
    expect(MergeResultProvider.fireUpdateContent).toHaveBeenCalled();
  });
});

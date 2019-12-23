import { IMergeResultLine } from '../../model/line';

export const getInitialMergeResult = (
  commonAncestor: string[],
  manualAddedLines: [] // todo
): IMergeResultLine[] =>
  commonAncestor.map(line => ({
    content: [line],
    paddingBottom: 0,
    wasRemoved: false,
    wasManualAdded: false, // // todo add via reduce manualAddedLines
  }));

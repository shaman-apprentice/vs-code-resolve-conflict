import { IMergeResultLine } from '../../model/line';

export const getInitialMergeResult = (
  commonAncestor: string[]
): IMergeResultLine[] =>
  commonAncestor.map(line => ({
    content: [line],
    paddingBottom: 0,
    wasRemoved: false,
    wasManualAdded: false,
  }));

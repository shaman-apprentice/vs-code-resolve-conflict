import { IVersionLine, IMergeResultLine } from './line';

export interface IParsedConflict {
  localChanges: IVersionLine[];
  mergeResult: IMergeResultLine[];
  remoteChanges: IVersionLine[];
  manualAddedLines: string[];
}

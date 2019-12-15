export interface IConflict {
  localChanges: ILocalConflict[];
  mergeResult: string[];
  // todo same implementation as for localChanges
  // and afterwards need for aligning padding for line sync
  remoteChanges: string;
}

export interface ILocalConflict {
  startLineRemoved: number;
  removedLines: string[];
  startLineAdded: number;
  addedLines: string[];
}

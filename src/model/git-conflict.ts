export interface IGitConflict {
  localChanges: ISingleGitConflict[];
  commonAncestor: string[];
  remoteChanges: ISingleGitConflict[];
}

export interface ISingleGitConflict {
  startRemoved: number;
  removedLines: string[];
  startAdded: number;
  addedLines: string[];
}

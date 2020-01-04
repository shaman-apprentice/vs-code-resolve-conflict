export interface IGitChanges {
  localChanges: ISingleGitChange[];
  commonAncestor: string[];
  remoteChanges: ISingleGitChange[];
}

export interface ISingleGitChange {
  startRemoved: number;
  removedLines: string[];
  startAdded: number;
  addedLines: string[];
}

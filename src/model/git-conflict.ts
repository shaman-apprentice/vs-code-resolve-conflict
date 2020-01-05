export interface IGitChanges {
  localChanges: ISingleGitChange[];
  commonAncestor: string;
  remoteChanges: ISingleGitChange[];
}

export interface ISingleGitChange {
  startRemoved: number;
  removedLines: string[];
  startAdded: number;
  addedLines: string[];
  isResolved?: boolean;
}

export enum VersionType {
  local,
  remote,
}

export interface IHandleSingleConflictArgs {
  type: VersionType;
  conflictIndex: number;
  shouldUse: boolean;
  startLine: number;
  endLine: number;
}

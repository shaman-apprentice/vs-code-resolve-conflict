export interface IConflict {
  localChanges: ILine[];
  mergeResult: ILine[];
  remoteChanges: ILine[];
}

export interface ILine {
  content: string;
  wasAdded: boolean;
  wasRemoved: boolean;
  /** used for padding-down text decoration to align with other lines in case of added/removed lines */
  emptyLineMarkdownCount: number;
}

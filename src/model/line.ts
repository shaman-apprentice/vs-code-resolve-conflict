export interface IMergeResultLine extends ILine {
  wasManualAdded?: boolean;
  wasRemovedLocal?: boolean;
  wasRemovedRemote?: boolean;
}

export interface IChangesLine extends ILine {
  wasAdded?: boolean;
}

export interface ILine {
  content: string;
  isAlignmentPadding?: boolean;
}

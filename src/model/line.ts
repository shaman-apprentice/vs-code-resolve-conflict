export interface ILines {
  content: string[];
  paddingBottom: number;
}

export interface IMergeResultLine extends ILines {
  wasManualAdded: boolean;
  wasRemoved: boolean;
}

export interface IVersionLine extends ILines {
  wasAdded: boolean;
}

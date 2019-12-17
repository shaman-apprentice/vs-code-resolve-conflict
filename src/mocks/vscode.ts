export const window = {
  createTextEditorDecorationType: () => null,
};

export class Position {
  constructor(public line: number, public character: number) {}
}

export class Range {
  constructor(public start: Position, public end: Position) {}
}

export class Uri {
  static parse(uri: string) {
    return uri;
  }
}

export class MarkdownString {
  isTrusted: boolean = false;
}

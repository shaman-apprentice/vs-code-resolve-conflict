import * as vscode from 'vscode';

export abstract class UpdatableDocument<UpdateEvent> {
  private onDidChangeEmitter = new vscode.EventEmitter<UpdateEvent>();
  public onDidChange = this.onDidChangeEmitter.event;

  private static instance: UpdatableDocument<any> | undefined;

  constructor() {
    UpdatableDocument.instance = this;
  }

  static fireUpdateContent() {
    UpdatableDocument.instance!.getChangeEvents().forEach(event => {
      UpdatableDocument.instance!.onDidChangeEmitter.fire(event);
    });
  }

  protected abstract getChangeEvents(): UpdateEvent[];
}

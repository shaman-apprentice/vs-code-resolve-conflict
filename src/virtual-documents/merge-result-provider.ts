import * as vscode from 'vscode';

import { StateManager } from '../controller/state-manager';
import { getMergeResult } from '../controller/editors/content';

export class MergeResultProvider implements vscode.FileSystemProvider {
  public static readonly scheme =
    'shaman-apprentice_resolve-conflict_merge-result_scheme';

  private onDidChangeEmitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
  readonly onDidChangeFile = this.onDidChangeEmitter.event;

  private static instance: MergeResultProvider | undefined;

  constructor() {
    MergeResultProvider.instance = this;
  }

  public static updateContent() {
    MergeResultProvider.instance!.onDidChangeEmitter.fire([
      {
        type: vscode.FileChangeType.Changed,
        uri: StateManager.editors.mergeResult.document.uri,
      },
    ]);
  }

  readFile(uri: vscode.Uri): Uint8Array {
    const content = getMergeResult(StateManager.conflict);
    return new TextEncoder().encode(content);
  }

  stat(uri: vscode.Uri): vscode.FileStat {
    return {
      type: vscode.FileType.File,
      ctime: Date.now(),
      mtime: Date.now(),
      size: 0,
    };
  }

  watch(uri: vscode.Uri, opts: any): vscode.Disposable {
    return new vscode.Disposable(() => {});
  }
  writeFile(uri: vscode.Uri, content: Uint8Array, opt: any): void {}
  delete(uri: vscode.Uri, opt: { recursive: boolean }): void {}
  rename(oldUri: vscode.Uri, newUri: vscode.Uri, opt: any): void {}
  readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
    throw new Error('This is a file provider only');
  }
  createDirectory(uri: vscode.Uri): void {}
}

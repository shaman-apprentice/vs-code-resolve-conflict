import * as vscode from 'vscode';
import * as path from 'path';

import { StateManager } from '../controller/state-manager';

export const openResolveConflict = (extensionCtx: vscode.ExtensionContext) => async (
  cmdCtx: any
) => {
  const fsPath = getFsPath(cmdCtx);
  if (!fsPath) return;

  const webViewResourcesPath = [extensionCtx.extensionPath, 'out', 'web-view'];
  const panel = vscode.window.createWebviewPanel(
    'shaman-apprentice.resolve-conflict',
    'TODO File Name',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(...webViewResourcesPath))],
    }
  );

  //StateManager.init(fsPath);
  panel.webview.html = getResolveConflictView(panel.webview, webViewResourcesPath);
};

const getFsPath = (ctx: any) => {
  if (ctx) return ctx.resourceUri.fsPath;

  if (vscode.window.activeTextEditor)
    return vscode.window.activeTextEditor.document.fileName;

  return null;
};

const getResolveConflictView = (
  webview: vscode.Webview,
  resourcesPath: string[]
) => {
  const toUrl = (resourcePath: string[]) =>
    webview.asWebviewUri(
      vscode.Uri.file(path.join(...resourcesPath, ...resourcePath))
    );

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${
          webview.cspSource
        } https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
      <link rel="stylesheet" type="text/css" href="${toUrl([
        'resolve-conflict.css',
      ])}" />
  </head>
  <body>
      <div>hi</div>
      <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />

      <script src="${toUrl(['resolve-conflict.js'])}"></script>
  </body>
  </html>`;
};

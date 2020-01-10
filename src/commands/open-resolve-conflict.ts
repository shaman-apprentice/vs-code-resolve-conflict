import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';

import { StateManager } from '../controller/state-manager';

export const openResolveConflict = (extensionCtx: vscode.ExtensionContext) => async (
  cmdCtx: any
) => {
  const fsPath = getFsPath(cmdCtx);
  if (!fsPath) return;

  const webViewResourcesPath = path.join(
    extensionCtx.extensionPath,
    'out',
    'web-view'
  );
  const panel = vscode.window.createWebviewPanel(
    'shaman-apprentice.resolve-conflict',
    'TODO File Name',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(webViewResourcesPath)],
    }
  );

  //StateManager.init(fsPath);
  panel.webview.html = await getResolveConflictView(
    panel.webview,
    webViewResourcesPath
  );
};

const getFsPath = (ctx: any) => {
  if (ctx) return ctx.resourceUri.fsPath;

  if (vscode.window.activeTextEditor)
    return vscode.window.activeTextEditor.document.fileName;

  return null;
};

const getResolveConflictView = async (
  webview: vscode.Webview,
  resourcesPath: string
) => {
  const getWebViewUrl = (name: string) =>
    webview.asWebviewUri(vscode.Uri.file(path.join(resourcesPath, name)));

  const webViewTemplate = await fs.readFile(
    path.join(resourcesPath, 'resolve-conflict.html'),
    'utf8'
  );

  return webViewTemplate
    .replace(
      '<meta csp-placeholder />',
      `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};"/>`
    )
    .replace(
      '<link rel="stylesheet" type="text/css" href="resolve-conflict.css" />',
      `<link rel="stylesheet" type="text/css" href="${getWebViewUrl(
        'resolve-conflict.css'
      )}"/>`
    )
    .replace(
      '<script src="../../out/web-view/resolve-conflict.js"></script>',
      `<script src="${getWebViewUrl('resolve-conflict.js')}"></script>`
    );
};

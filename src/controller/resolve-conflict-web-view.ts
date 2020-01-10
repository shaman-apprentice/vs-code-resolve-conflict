import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';

export const getView = async (extCtx: vscode.ExtensionContext) => {
  const webViewResourcesPath = path.join(extCtx.extensionPath, 'out', 'web-view');

  const webViewPanel = vscode.window.createWebviewPanel(
    'shaman-apprentice.resolve-conflict',
    'TODO File Name',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(webViewResourcesPath)],
    }
  );

  webViewPanel.webview.html = await getResolveConflictView(
    webViewPanel.webview,
    webViewResourcesPath
  );

  return webViewPanel;
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

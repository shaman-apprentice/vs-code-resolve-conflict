import * as vscode from 'vscode';

export const openResolveConflict = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  editor.setDecorations(createDecoratorType(), [
    {
      range: new vscode.Range(
        new vscode.Position(2, 0),
        new vscode.Position(3, 0)
      ),
      hoverMessage: [getHover(), 'hi 2']
    }
  ]);
};

const createDecoratorType = () =>
  vscode.window.createTextEditorDecorationType({
    backgroundColor: 'orange',
    border: '4px solid red'
  });

const getHover = () => {
  const cmd = vscode.Uri.parse('command:say-hi?[{"arg":"bla"}]');
  const hover = new vscode.MarkdownString(`[do something](${cmd})`);
  hover.isTrusted = true;
  return hover;
};

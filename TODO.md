Technical questions:

- setCommandContext
- namespaces (commands, schemes)
- read in more detail about vscode url scheme (should scheme have the form of "name://"?)

MVP:

- readme incl. demo gif
- handle manual changes in mergeResult
- implement save / apply changes
- if already open only update data and not reopen editors

Nice to Haves:

- str+z support
- make color (including icon svg) customizable
- integration tests with a git-repo which has merge conflicts
  - git submodules vs git subtree?
- minify code as pre-publish
- show next conflict (in overview lane as well)
- sync scrolling
- consider user settings of '\n' (parsing from git, writing to vs code text document)
- take my / theirs option for resolving conflict
- jump / scroll to first conflict on open
- investigate editor becomes not visible and visible again -> decorations need to be reapplied
  ```js
  vscode.window.onDidChangeVisibleTextEditors(visibleTextEditors => {
    console.log('-----');
    visibleTextEditors.forEach(editor => {
      console.log(editor.document.uri.path);
      // TextEditor is closed/disposed ? why? - This makes setting of decorations not possible
    });
  });
  ```

Technical questions:

- setCommandContext
- namespaces (commands, schemes)
- read in more detail about vscode url scheme (should scheme have the form of "name://"?)

MVP:

- check for cross-os usage of "\n" symbol
- add dismiss option
- readme incl. demo gif
- align lines / padding of three views
- apply decorations to all 3 views
- handle manual changes in mergeResult
- implement save / apply changes
  - show error if not all conflicts are resolved

Nice to Haves:

- integration tests with a git-repo which has merge conflicts
- minify code as pre-publish
- show next conflict (in overview lane as well)
- sync scrolling
- vscode.setEditorLayout for setting 3 way and restoring old on close

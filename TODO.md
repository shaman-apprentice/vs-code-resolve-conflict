Technical questions:

- setCommandContext
- namespaces (commands, schemes)
- read in more detail about vscode url scheme (should scheme have the form of "name://"?)

MVP:

- readme incl. demo gif
- align lines / padding of three views
- apply decorations to all 3 views
- handle manual changes in mergeResult
- implement save / apply changes

Nice to Haves:

- make color (including icon svg) customizable
- integration tests with a git-repo which has merge conflicts
- minify code as pre-publish
- show next conflict (in overview lane as well)
- sync scrolling
- consider user settings of '\n' (parsing from git, writing to vs code text document)
- custom line numbers and padding (create FR on github?) instead of simple adding new lines for aligning views
- take my / theirs option for resolving conflict
- jump / scroll to first conflict on open

import { parseDiff } from './analyzer';

describe('parse `git diff --unified=0 ${id1} ${id2}` into `ILocalConflict[]`', () => {
  it('only single line diffs', () => {
    const gitDiff = `diff --git a/5d8d1fae8cfde2c848336bfbe5a0b0871e0ff61f b/9356eeb92a50336d75755632a460a367ed1741df
index 5d8d1fa..9356eeb 100644
--- a/5d8d1fae8cfde2c848336bfbe5a0b0871e0ff61f
+++ b/9356eeb92a50336d75755632a460a367ed1741df
@@ -3 +3 @@ fst line
-snd line
+thrd line
@@ -5 +5 @@ snd line
-5th line
+fifth line
`;

    expect(parseDiff(gitDiff)).toEqual([
      {
        startLineRemoved: 2,
        removedLines: ['snd line'],
        startLineAdded: 2,
        addedLines: ['thrd line'],
      },
      {
        startLineRemoved: 4,
        removedLines: ['5th line'],
        startLineAdded: 4,
        addedLines: ['fifth line'],
      },
    ]);
  });

  it('two line diff', () => {
    const gitDiff = `diff --git a/5d8d1fae8cfde2c848336bfbe5a0b0871e0ff61f b/bfaf4c047635a13fa395228b20348e95b0aebea7
index 5d8d1fa..bfaf4c0 100644
--- a/5d8d1fae8cfde2c848336bfbe5a0b0871e0ff61f
+++ b/bfaf4c047635a13fa395228b20348e95b0aebea7
@@ -3 +3,2 @@ fst line
-snd line
+snd line
+added a line
`;

    expect(parseDiff(gitDiff)).toEqual([
      {
        startLineRemoved: 2,
        removedLines: ['snd line'],
        startLineAdded: 2,
        addedLines: ['snd line', 'added a line'],
      },
    ]);
  });
});

import { getCommonAncestorContent, getConflictObjectIds, getDiff } from './git-cmds';
import { ILine } from './conflict.interface';

export const analyzeConflict = async (filePath: string): Promise<any> => {
  const commonAncestorContent = await getCommonAncestorContent(filePath);
  const [ancestorId, localId, remoteId] = await getConflictObjectIds(filePath);

  const ancestorLocalDiff = buildAnalyzedDiff(
    commonAncestorContent,
    await getDiff(filePath, ancestorId, localId)
  );

  // todo ancestorRemoteDiff

  return {
    localChanges: ancestorLocalDiff.other,
    mergeResult: ancestorLocalDiff.ancestor,
    remoteChanges: 'currently still a static string',
  };
};

const buildAnalyzedDiff = (ancestorContent: string, diff: string) => {
  const ancestor: ILine[] = getInitILines(ancestorContent);
  const other: ILine[] = getInitILines(ancestorContent);
  const diffLines: string[] = diff.split('\n').splice(4);

  // todo: develop test driven
  // let currentConflictingLine;
  // for (let line of diffLines) {
  //   if (line.startsWith('@@')) {
  //     const conflictingLineNumber = +line.match(/([0-9])+/)![0];
  //   }
  // }

  // todo mocked implementation for PoC
  ancestor[2].wasRemoved = true;
  other[2].wasAdded = true;
  other[2].content = 'thrd line';

  return { ancestor, other };
};

const getInitILines = (ancestorContent: string): ILine[] =>
  ancestorContent.split('\n').map(line => ({
    content: line,
    wasAdded: false,
    wasRemoved: false,
    emptyLineMarkdownCount: 0,
  }));

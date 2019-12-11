import { getCommonAncestorContent, getConflictObjectIds, getDiff } from './git-cmds';

export async function analyzeConflict(filePath: string): Promise<any> {
  const commonAncestorContent = await getCommonAncestorContent(filePath);
  const [ancestorId, localId, remoteId] = await getConflictObjectIds(filePath);
  const ancestorLocalDiff = await getDiff(filePath, ancestorId, localId);

  // todo ancestorRemoteDiff

  return {
    localChanges: 'local',
    mergeResult: commonAncestorContent,
    remoteChanges: 'currently still a static string',
  };
}

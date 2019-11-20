import { promises as fs } from 'fs';

export const initConflictData = async (fsPath: string) => {
  const content = await fs.readFile(fsPath, { encoding: 'utf-8' });
  // todo get real data
  return {
    local: content,
    mergeResult: content,
    remote: content,
  };
};

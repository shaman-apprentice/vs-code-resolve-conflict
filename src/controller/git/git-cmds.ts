import { exec } from 'child_process';
import * as path from 'path';

// todo get all of those from one `exec`

const execCmd = (cmd: string, cwd: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout) => {
      if (error !== null) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });

export const getCommonAncestorContent = (fsPath: string) =>
  execCmd(`git show :1:${path.basename(fsPath)}`, path.dirname(fsPath));

/** @returns [ancestorObjectId, localObjectId, remoteObjectId] */
export const getConflictObjectIds = async (fsPath: string): Promise<string[]> => {
  const fileName = path.basename(fsPath);
  const output = await execCmd(`git ls-files -u ${fileName}`, path.dirname(fsPath));
  return output
    .split(fileName)
    .map(line => line.trim())
    .filter(line => line !== '')
    .map(line => line.split(' ')[1]);
};

export const getDiff = (fsPath: string, id1: string, id2: string) =>
  execCmd(`git diff --unified=0 ${id1} ${id2}`, path.dirname(fsPath));

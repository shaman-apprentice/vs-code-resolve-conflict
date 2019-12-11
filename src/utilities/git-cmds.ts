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

export const getCommonAncestorContent = (filePath: string) => {
  return execCmd(`git show :1:${path.basename(filePath)}`, path.dirname(filePath));
};

/** returns [ancestorObjectId, localObjectId, remoteObjectId] */
export const getConflictObjectIds = async (filePath: string): Promise<string[]> => {
  const output = await execCmd(
    `git ls-files -s ${path.basename(filePath)}`,
    path.dirname(filePath)
  );
  return output.split('\n').map(line => line.split(' ')[1]);
};

export const getDiff = (filePath: string, id1: string, id2: string) => {
  return execCmd(`git diff --unified=0 ${id1} ${id2}`, path.dirname(filePath));
};

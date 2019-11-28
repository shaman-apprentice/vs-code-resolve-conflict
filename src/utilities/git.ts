import { exec } from 'child_process';
import * as path from 'path';

const execCmd = async (cmd: string, cwd: string) =>
  new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout) => {
      if (error !== null) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });

export const getCommonAncestor = (file: string) => {
  return execCmd(`git show :1:${path.basename(file)}`, path.dirname(file));
};

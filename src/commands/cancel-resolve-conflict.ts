import { StateManager } from '../controller/state-manager';

export const cancelResolveConflict = async (ctx: any) => {
  await StateManager.close();
};

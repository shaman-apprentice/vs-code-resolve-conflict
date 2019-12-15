import { StateManager } from '../controller/state-manager';

export const applyResolveConflict = async (ctx: any) => {
  await StateManager.save();
};

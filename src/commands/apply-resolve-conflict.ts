import { StateManager } from '../utilities/state-manager';

export const applyResolveConflict = async (ctx: any) => {
  await StateManager.save();
};

import { TaskContext } from './types';

let GlobalTaskContext: TaskContext | undefined;

/**
 * Gets the task context.
 */
export const getTaskContext = (): TaskContext => {
  if (GlobalTaskContext === undefined) {
    throw new Error('Task context not initialized');
  }
  return GlobalTaskContext;
};

/**
 * Sets the task context.
 * @param context - Task new context.
 */
export const setTaskContext = (context: TaskContext) => {
  GlobalTaskContext = context;
};

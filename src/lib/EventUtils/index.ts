import { BeforeRemoveEventArgs } from 'types/events';

/**
 * Check if the event is a go back event.
 * @param event - Event to check.
 */
// Disable the default export warning as we might have more functions in the future.
// eslint-disable-next-line import/prefer-default-export
export const isGoBackEvent = (event: BeforeRemoveEventArgs): boolean => {
  return event.data.action.type === 'GO_BACK' || event.data.action.type === 'POP';
};

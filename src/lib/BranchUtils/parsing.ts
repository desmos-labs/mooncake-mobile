import { UriAction, UriActions, UriContexts } from 'types/uriActions';

/**
 * Enum that contains all the possible keys that can be contained in the params
 * received from branch a deep link.
 */
enum ParamsKey {
  PostID = 'post_id',
  Address = 'address',
}

/**
 * Enum that defines the possible actions that can be received from branch.
 */
enum BranchAction {
  General = '',
  ViewPost = 'view_post',
}

/**
 * Type that defines a parser capable of parse a specific {@link UriAction}.
 */
type UriActionParser = (data: Record<string, any>) => UriAction | undefined;

/**
 * Map that contains the various parser that can be used to parse
 * an {@link UriAction} received from branch.
 */
const UriActionParsers: Record<string, UriActionParser> = {
  [BranchAction.General]: params => {
    if (!isAddressValid(params[ParamsKey.Address])) {
      return undefined;
    }

    return {
      context: UriContexts.General,
      userAddress: params[ParamsKey.Address],
    };
  },
  [BranchAction.ViewPost]: params => {
    if (typeof params[ParamsKey.PostID] !== 'string') {
      return undefined;
    }

    return {
      context: UriContexts.Posts,
      action: UriActions.Show,
      postId: params[ParamsKey.PostID],
    };
  },
};

/**
 * Checks if the provided action is a valid instance of {@link BranchAction}.
 * @param action - The action to be validated.
 */
const isValidAction = (action: any): action is BranchAction =>
  typeof action === 'string' && Object.values(BranchAction).includes(action as BranchAction);

/**
 * Validates if the given address is a valid Desmos Bech32 address.
 * @param address - The address to be validated.
 */
const isAddressValid = (address: any): address is string =>
  typeof address === 'string' && address.indexOf('desmos1') === 0 && address.length === 45;

/**
 * Parses the branch parameters and returns the corresponding UriAction.
 *
 * @param {Record<string, any>} params - The branch parameters to parse.
 * @return {UriAction | undefined} - The parsed UriAction or undefined if the action is not valid.
 */
// eslint-disable-next-line import/prefer-default-export
export const parseBranchParams = (params: Record<string, any>): UriAction | undefined => {
  const { action } = params;
  if (!isValidAction(action)) {
    return undefined;
  }

  const parser = UriActionParsers[action];
  if (parser === undefined) {
    return undefined;
  }

  return parser(params);
};

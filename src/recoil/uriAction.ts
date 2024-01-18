import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { UriAction } from 'types/uriActions';

/**
 * Atom that contains the current uri action that need to be handled.
 */
const uriActionState = atom<UriAction | undefined>({
  key: 'uriActionState',
  default: undefined,
});

/**
 * Hook that provides the {@link UriAction} that need to be handled.
 */
export const useUriAction = () => useRecoilValue(uriActionState);

/**
 * Hook that provides a function to update the {@link UriAction} that need to be handled.
 */
export const useSetUriAction = () => useSetRecoilState(uriActionState);

import React from 'react';
import {atom, selectorFamily, useRecoilValue, useSetRecoilState} from 'recoil';
import {UploadAssetType} from 'services/axios/requests/UploadMedia';

export interface SignUpState {
  readonly dtag: string;
  readonly nickname: string;
  readonly bio: string;
  readonly coverPicture: UploadAssetType | undefined;
  readonly profilePicture: UploadAssetType | undefined;
}

/**
 * Default state of the SignUp screen.
 */
const DefaultSignUpState: SignUpState = {
  dtag: '',
  nickname: '',
  bio: '',
  coverPicture: undefined,
  profilePicture: undefined,
};

/**
 * Atom containing the current state of the SignUp screen.
 */
const signUpState = atom({
  key: 'signUpState',
  default: DefaultSignUpState,
});

/**
 * Recoil that allows to select a single {@link SignUpState} value.
 */
const signUpStateValue = selectorFamily({
  key: 'signUpStateValue',
  get:
    (key: keyof SignUpState) =>
    ({get}) => {
      const settings = get(signUpState);
      return settings[key];
    },
});

/**
 * Hook that allows to observe only a single {@link SignUpState} value.
 * @param valueKey - Key associated to the value that needs to be retrieved.
 * @return The value of the state associated with the given key.
 */
export const useSignUpValue = <K extends keyof SignUpState>(valueKey: K) =>
  useRecoilValue(signUpStateValue(valueKey)) as SignUpState[K];

/**
 * Hook that provides a function to update the value of a single {@link SignUpState} field.
 * @param valueKey - Key of the value of interest.
 */
export const useSetSignUpValue = <K extends keyof SignUpState>(valueKey: K) => {
  const setSignUpState = useSetRecoilState(signUpState);
  return React.useCallback(
    (value: SignUpState[K]) => {
      setSignUpState(currentValue => {
        const values: SignUpState = {
          ...currentValue,
        };
        values[valueKey] = value;
        return values;
      });
    },
    [valueKey, setSignUpState],
  );
};

/**
 * Hook that allows to reset the current state of the signup screen.
 */
export const useResetSignUpState = () => {
  const setSignUpState = useSetRecoilState(signUpState);
  return React.useCallback(() => {
    setSignUpState(DefaultSignUpState);
  }, [setSignUpState]);
};

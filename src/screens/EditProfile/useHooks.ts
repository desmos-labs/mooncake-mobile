import {profileParamsState} from '@recoil/profileParams';
import {useRecoilValue} from 'recoil';
import useValidationSchema from './useValidationSchema';

const useHooks = () => {
  const profileParams = useRecoilValue(profileParamsState);
  const dtagMinLength = 6; // override the value (3) from query, 6 for App
  const nicknameMaxLength = 30; // override the value (1000) from query, 30 for App

  const validationSchema = useValidationSchema(
    profileParams,
    nicknameMaxLength,
    dtagMinLength,
  );

  return {
    validationSchema,
  };
};

export default useHooks;

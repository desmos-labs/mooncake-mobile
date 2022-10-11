import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

/**
 * @param {ProfileParams} profileParams - This is the object that contains the validation rules for the profile fields.
 * @param {number} nicknameMaxLength - The maximum length of the nickname.
 * @param {number} dtagMinLength - The minimum length of the dtag.
 * @returns A function that returns a Yup object.
 */
function useValidationSchema(
  profileParams: ProfileParams,
  nicknameMaxLength: number,
  dtagMinLength: number,
) {
  const {t} = useTranslation();
  return useMemo(() => {
    return Yup.object().shape({
      nickname: Yup.string()
        .min(profileParams.nickname.min_length)
        .max(nicknameMaxLength),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(dtagMinLength)
        .max(profileParams.dtag.max_length)
        .test(
          'respect reg_ex',
          t('Only _ is allowed as special character'),
          value => {
            return new RegExp(profileParams.dtag.reg_ex, 'g').test(
              value as string,
            );
          },
        ),
      bio: Yup.string().max(
        parseInt(profileParams.bio.max_length, 10),
        t('error:maxLength', {
          numChars: profileParams.bio.max_length,
        }),
      ),
    });
  }, [profileParams, nicknameMaxLength, dtagMinLength]);
}

export default useValidationSchema;

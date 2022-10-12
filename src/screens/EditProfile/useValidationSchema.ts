import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

/**
 * @param {ProfileParams} profileParams - This is the object that contains the validation rules for the profile fields.
 * @returns A function that returns a Yup object.
 */
function useValidationSchema(profileParams: ProfileParams) {
  const {t} = useTranslation();
  return useMemo(() => {
    return Yup.object().shape({
      nickname: Yup.string()
        .min(profileParams.nickname.min_length)
        .max(profileParams.nickname.max_length),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(profileParams.dtag.min_length)
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
  }, [profileParams]);
}

export default useValidationSchema;

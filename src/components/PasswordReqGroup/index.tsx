import React from 'react';
import PasswordTooltip from 'screens/PasswordManipulation/components/PasswordTooltip';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {
  MIN_PW_LENGTH,
  validateMin1Lowercase,
  validateMin1SpecialChar,
  validateMin1Uppercase,
  validateMinPwLength,
} from 'lib/ValidationUtils';

type Props = {
  passwordToCheck: string;
};

const PasswordReqGroup = ({passwordToCheck}: Props) => {
  const theme = useTheme();

  const {t} = useTranslation('common');

  return (
    <Spacer paddingTop={theme.spacing.s} paddingBottom={theme.spacing.m}>
      <PasswordTooltip
        label={t('atLeastChar', {
          length: MIN_PW_LENGTH,
        })}
        isSatisfied={validateMinPwLength(passwordToCheck)}
      />

      <PasswordTooltip
        label={t('atLeastLower')}
        isSatisfied={validateMin1Lowercase(passwordToCheck)}
      />

      <PasswordTooltip
        label={t('atLeastUpper')}
        isSatisfied={validateMin1Uppercase(passwordToCheck)}
      />

      <PasswordTooltip
        label={t('atLeastSpecial')}
        isSatisfied={validateMin1SpecialChar(passwordToCheck)}
      />
    </Spacer>
  );
};

export default PasswordReqGroup;

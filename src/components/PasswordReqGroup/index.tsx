import React from 'react';
import { useTranslation } from 'react-i18next';
import { MIN_PW_LENGTH, validateMinPwLength } from 'lib/ValidationUtils';
import PasswordTooltip from './PasswordTooltip';

type Props = {
  passwordToCheck: string;
};

const PasswordReqGroup = ({ passwordToCheck }: Props) => {
  const { t } = useTranslation('common');

  return (
    <PasswordTooltip
      label={t('atLeastChar', {
        length: MIN_PW_LENGTH,
      })}
      isSatisfied={validateMinPwLength(passwordToCheck)}
    />
  );
};

export default PasswordReqGroup;

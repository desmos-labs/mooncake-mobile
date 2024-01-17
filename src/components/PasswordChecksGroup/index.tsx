import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import ErrorTooltip from 'components/PasswordChecksGroup/ErrorTooltip';
import { isPswMaxStrength, validatePswStrength } from 'lib/ValidationUtils';
import { useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import PasswordTooltip from './PasswordTooltip';

type Props = {
  label?: string;
  passwordToCheck?: string;
  mode: 'password' | 'error';
};

const PasswordChecksGroup = ({ passwordToCheck, mode, label }: Props) => {
  const { t } = useTranslation('password');
  const theme = useTheme();

  const Message = useMemo(() => {
    if (isPswMaxStrength(passwordToCheck)) {
      return;
    }
    if (validatePswStrength(passwordToCheck)) {
      return (
        <Typography.Regular14
          style={{ color: theme.colors.surfaceBlack, marginVertical: theme.spacing.s }}>
          {t('recommend password')}
        </Typography.Regular14>
      );
    } else {
      return <PasswordTooltip label={t('strong password')} />;
    }
  }, [passwordToCheck, t, theme.colors.surfaceBlack, theme.spacing.s]);

  return mode === 'password' ? (
    <View>{Message}</View>
  ) : (
    <ErrorTooltip label={label || t('strong password')} />
  );
};

export default PasswordChecksGroup;

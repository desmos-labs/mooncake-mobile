import Button, { ButtonMode } from 'components/Button';
import Typography from 'components/Typography';

import ToastConfig from 'config/ToastConfig';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'native-base';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface Props {
  /**
   * The type of toast to be shown. Directly affects the appearance of the toast.
   */
  type: ToastConfig;

  /**
   * The message that will be displayed in the toast.
   */
  message: string;

  options: {
    /**
     * What to do when the actual toast object is pressed.
     */
    handlePressToast?: () => void;

    /**
     * What to do if the Retry button is pressed (only applicable for ERROR type toasts).
     */
    handlePressRetry?: () => void;
  };
}

/**
 * Implementation of the Custom Toast component which is used to show toasts to the user.
 * @constructor
 */
const CustomToast = ({ type, message, options }: Props): JSX.Element => {
  const styles = useStyles(type);
  const theme = useTheme();
  const { t } = useTranslation('');

  return (
    <Shadow startColor="rgba(133, 133, 133, 0.06)" distance={12} offset={[0, 10]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={options.handlePressToast}
        style={styles.commonToastStyle}>
        <View>
          {type !== ToastConfig.SUCCESS && (
            <Typography.Subtitle3>{t('common:oops')}</Typography.Subtitle3>
          )}
          <Typography.Body6 numberOfLines={2} style={{ color: theme.colors.surfaceBlack }}>
            {message}
          </Typography.Body6>
        </View>

        {type === ToastConfig.ERROR ? (
          <Button
            size={32}
            additionalStyle={styles.button}
            mode={ButtonMode.TEXT}
            onPress={options.handlePressRetry}>
            <Typography.Subtitle3>{t('toast:retry')}</Typography.Subtitle3>
          </Button>
        ) : null}
      </TouchableOpacity>
    </Shadow>
  );
};

export default CustomToast;

import Button, { ButtonMode } from 'components/Button';
import Typography from 'components/Typography';

import ToastConfig from 'config/ToastConfig';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Toast, useTheme } from 'native-base';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
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

    id: string;
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

  /**
   * A swipe up gesture what will clear all visible toasts.
   */
  const swipeUpGesture = React.useMemo(
    () =>
      Gesture.Fling()
        .runOnJS(true)
        .direction(Directions.UP)
        .onStart(() => {
          // Need to use the global instance of Toast instead of the hook as the latter is not able to dismiss toasts
          // that were created outside this context.
          Toast.closeAll();
        }),
    [],
  );

  /**
   * A swipe right gesture that will clear the swiped toast.
   */
  const swipeRightGesture = React.useMemo(
    () =>
      Gesture.Fling()
        .runOnJS(true)
        .direction(Directions.RIGHT)
        .onStart(() => {
          Toast.close(options.id);
        }),
    // This warning can be ignored as options will never change after initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <GestureDetector gesture={swipeRightGesture}>
      <GestureDetector gesture={swipeUpGesture}>
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
      </GestureDetector>
    </GestureDetector>
  );
};

export default CustomToast;

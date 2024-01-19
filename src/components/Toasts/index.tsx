import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { squaresAnimation } from 'assets/animations';
import Button from 'components/Button';
import ThemedLottieView from 'components/ThemedLottieView';
import { makeStyleWithProps } from 'config/theme';
import lightTheme from 'config/theme/LightTheme';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export interface ToastProps {
  /**
   *  The message to display.
   */
  readonly message: string;
  /**
   * Optional title that will display in bold above
   * the message.
   */
  readonly title?: string;
  /**
   * Tells if the loading animation should be shown.
   * If undefined will default to false.
   */
  readonly showLoadingAnimation?: boolean;
  /**
   * Label that will be displayed on the action button.
   */
  readonly actionLabel?: string;
  /**
   * Action that will be called when the action button is pressed.
   * If the action label is undefined the action button will not be shown.
   */
  readonly action?: () => void;
  /**
   * Optional styles override.
   */
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * The configurations to create a toast component.
 */
interface ToastConfig {
  /**
   * Toast background color.
   */
  readonly backgroundColor: string;
  /**
   * Toast border color.
   */
  readonly borderColor: string;
}

/**
 * Function that given a {@link ToastConfig} will
 * create a toast component with the given configuration.
 */
const makeToastComponent: (config: ToastConfig) => React.FC<ToastProps> = config => {
  return ({ message, title, showLoadingAnimation, actionLabel, action, style }) => {
    const styles = useToastStyle(config);

    return (
      <View style={[styles.root, style]}>
        <View style={styles.textContainer}>
          {title && <Typography.Semibold16>{title}</Typography.Semibold16>}
          <Typography.Regular14>{message}</Typography.Regular14>
        </View>
        <View style={styles.itemsContainer}>
          {showLoadingAnimation === true && (
            <ThemedLottieView
              autoSize
              loop
              autoPlay
              source={squaresAnimation}
              style={styles.loadingAnimation}
            />
          )}
          {actionLabel && action && (
            <Button type="text" onPress={action}>
              <Typography.Semibold14>{actionLabel}</Typography.Semibold14>
            </Button>
          )}
        </View>
      </View>
    );
  };
};

const useToastStyle = makeStyleWithProps((props: ToastConfig, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: props.backgroundColor,
    borderColor: props.borderColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textContainer: {
    flex: 1,
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: theme.spacing.xs,
  },
  loadingAnimation: {
    width: 32,
    height: 32,
  },
}));

const Toasts = {
  Success: makeToastComponent({
    backgroundColor: lightTheme.colors.toast.successBackground,
    borderColor: lightTheme.colors.toast.successBorder,
  }),
  Error: makeToastComponent({
    backgroundColor: lightTheme.colors.toast.errorBackground,
    borderColor: lightTheme.colors.toast.errorBorder,
  }),
};

export default Toasts;

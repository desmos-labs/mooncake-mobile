import {StackScreenProps} from '@react-navigation/stack';
import {modalSuccess} from 'assets/images';
import Button, {ButtonMode, ButtonSize} from 'components/Button';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React, {ReactNode} from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Pressable,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import ROUTES from 'navigation/routes';
import {useRoute} from '@react-navigation/native';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.FULLSCREEN_STATUS_SCREEN
>;

/**
 * @property {ImageSourcePropType} image - The image to display in the background.
 * @property {ReactNode | string} title - The title of the screen.
 * @property {ReactNode | string} subtitle - The subtitle of the screen.
 * @property {ReactNode | string} buttonLabel - The label for the primary button.
 * @property handleButtonPress - This is the function that will be called when the primary button is
 * pressed.
 * @property {ReactNode | string} secondaryButtonLabel - The label for the secondary button.
 * @property handleSecondaryButtonPress - This is the function that will be called when the secondary
 * button is pressed.
 * @property handleBackgroundPress - This is the function that will be called when the user taps on the
 * background.
 */
export type FullscreenStatusScreenParams = {
  image?: ImageSourcePropType;
  title: ReactNode | string;
  subtitle: ReactNode | string;
  buttonLabel: ReactNode | string;
  handleButtonPress: () => void;
  secondaryButtonLabel?: ReactNode | string;
  handleSecondaryButtonPress?: () => void;
  handleBackgroundPress?: () => void;
};

const FullscreenStatusScreen = () => {
  const styles = useStyles();
  const theme = useTheme();

  const {
    params: {
      image,
      title,
      subtitle,
      buttonLabel,
      handleButtonPress,
      secondaryButtonLabel,
      handleSecondaryButtonPress,
      handleBackgroundPress,
    },
  } = useRoute<NavProps['route']>();

  return (
    <DView
      backgroundColor="transparent"
      onBackgroundPress={handleBackgroundPress}
      style={styles.root}>
      <Pressable
        style={styles.cardContainer}
        onPressIn={stopEventPropagation}
        android_disableSound>
        <Typography.H4 style={styles.title}>{title}</Typography.H4>
        <Image
          source={image || modalSuccess}
          style={styles.image}
          resizeMode="contain"
        />
        <Typography.Body6 style={styles.subtitle}>{subtitle}</Typography.Body6>
        <Button
          size={ButtonSize.M}
          additionalStyle={styles.button}
          textColor={theme.colors.white}
          backgroundColor={theme.colors.surfaceBlack}
          mode={ButtonMode.CONTAINED}
          onPress={handleButtonPress}>
          {buttonLabel}
        </Button>
        {!!secondaryButtonLabel && (
          <Button
            size={ButtonSize.M}
            additionalStyle={styles.button}
            mode={ButtonMode.OUTLINED}
            onPress={handleSecondaryButtonPress}>
            <Typography.Button2>{secondaryButtonLabel}</Typography.Button2>
          </Button>
        )}
      </Pressable>
    </DView>
  );
};

function stopEventPropagation(event: GestureResponderEvent) {
  event.stopPropagation();
}

export default FullscreenStatusScreen;

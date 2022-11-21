import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
// dismiss button
// import {iconCross} from 'assets/images';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {ReactNode} from 'react';
import {Trans} from 'react-i18next';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type ConfirmModalParams = {
  /**
   * The title of the modal. This should be the immediate result
   * of whatever the user was doing.
   */
  title?: string | ReactNode;
  /**
   * Additional description for the title.
   */
  subtitle?: string | ReactNode;
  subtitleStyle?: StyleProp<TextStyle>;

  /**
   * Image to be shown between the title and subtitle
   */
  image?: ImageSourcePropType;

  /**
   * Label of the primary button.
   */
  primaryButtonLabel?: string | ReactNode;
  /**
   * Label of the secondary button.
   */
  secondaryButtonLabel?: string | ReactNode;
  /**
   * What to do when the user presses the close button.
   */
  onDismiss?: () => void;
  /**
   * What to do when the user presses the primary (main) modal button.
   */
  onPressPrimary?: () => void;
  /**
   * What to do when the user presses the secondary (bottom-one) modal button.
   */
  onPressSecondary?: () => void;
  /**
   * If you want to remove the modal after the primary button press
   */
  removeModalAfterButtonPress?: boolean;

  /**
   * The mode of the primary button.
   * @default contained
   */
  primaryButtonMode?:
    | 'text'
    | 'outlined'
    | 'contained'
    | 'gradient'
    | 'gradientFilled'
    | 'backgroundComponent';

  /**
   * The mode of the secondary button.
   * @default text
   */
  secondaryButtonMode?:
    | 'text'
    | 'outlined'
    | 'contained'
    | 'gradient'
    | 'gradientFilled'
    | 'backgroundComponent';
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONFIRM_MODAL>;

const ConfirmModal = () => {
  const {
    params: {
      title,
      subtitle,
      subtitleStyle,
      primaryButtonLabel,
      secondaryButtonLabel,
      onDismiss,
      onPressPrimary,
      onPressSecondary,
      removeModalAfterButtonPress,
      image,
      primaryButtonMode = 'contained',
      secondaryButtonMode = 'text',
    },
  } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const theme = useTheme();

  const {goBack} = useNavigation<NavProps['navigation']>();

  const onPressPrimaryButton = () => {
    if (removeModalAfterButtonPress) {
      goBack();
      onPressPrimary && setTimeout(() => onPressPrimary(), 200);
    } else {
      onPressPrimary && onPressPrimary();
    }
  };

  return (
    <View style={styles.container}>
      {/* invoke dismiss fn or goBack if user presses the background */}
      <TouchableOpacity
        onPress={onDismiss || goBack}
        activeOpacity={1}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.innerContainer}>
        <Typography.H5 style={{textAlign: 'center'}}>{title}</Typography.H5>
        {image && <Image source={image} style={styles.imageStyle} />}

        <Typography.Body5 style={[styles.subtitleText, subtitleStyle]}>
          <Trans
            i18nKey={subtitle as string}
            components={[<Typography.Subtitle2 style={subtitleStyle} />]}
          />
        </Typography.Body5>
        {primaryButtonLabel && (
          <Button
            style={styles.primaryButton}
            mode={primaryButtonMode}
            onPress={onPressPrimaryButton}>
            {primaryButtonLabel}
          </Button>
        )}
        {secondaryButtonLabel && (
          <Button
            containerStyle={styles.secondaryButton}
            color={theme.colors.surfaceBlack}
            mode={secondaryButtonMode as any}
            onPress={onPressSecondary}>
            {secondaryButtonLabel}
          </Button>
        )}
      </View>
    </View>
  );
};

export default ConfirmModal;

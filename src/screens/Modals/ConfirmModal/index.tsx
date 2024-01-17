// dismiss button
// import {iconCross} from 'assets/images';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import Button, { ButtonVariant } from 'components/Button';
import Spacer from 'components/Spacer';
import CommonStyles from 'config/theme/CommonStyles';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import useStyles from './useStyles';

export enum ButtonsLayout {
  Row = 'row',
  Column = 'column',
}

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
  primaryButtonLabel?: string;
  /**
   * Label of the secondary button.
   */
  secondaryButtonLabel?: string;
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
  primaryButtonMode?: ButtonVariant;

  /**
   * If the primary button should be in loading state
   */
  primaryButtonLoading?: boolean;

  /**
   * The mode of the secondary button.
   * @default text
   */
  secondaryButtonMode?: ButtonVariant;
  /**
   * If the secondary button should be in loading state
   */
  secondaryButtonLoading?: boolean;
  /**
   * Tells how the buttons should be laid out.
   * If undefined will default to {@link ButtonsLayout.Column}.
   */
  buttonsLayout?: ButtonsLayout;
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
      primaryButtonMode = 'solid',
      secondaryButtonMode = 'link',
      primaryButtonLoading,
      secondaryButtonLoading,
      buttonsLayout = ButtonsLayout.Column,
    },
  } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const theme = useTheme();

  const { goBack } = useNavigation<NavProps['navigation']>();

  const onPressPrimaryButton = React.useCallback(() => {
    if (removeModalAfterButtonPress) {
      goBack();
      onPressPrimary && setTimeout(() => onPressPrimary(), 200);
    } else {
      onPressPrimary && onPressPrimary();
    }
  }, [goBack, onPressPrimary, removeModalAfterButtonPress]);

  const onPressSecondaryButton = React.useCallback(() => {
    if (removeModalAfterButtonPress) {
      goBack();
      onPressSecondary && setTimeout(() => onPressSecondary(), 200);
    } else {
      onPressSecondary && onPressSecondary();
    }
  }, [goBack, onPressSecondary, removeModalAfterButtonPress]);

  const buttons = React.useMemo(() => {
    return (
      <View style={buttonsLayout === ButtonsLayout.Row ? styles.buttonsRow : undefined}>
        {primaryButtonLabel && (
          <Button
            style={buttonsLayout === ButtonsLayout.Row ? styles.inlineButton : undefined}
            isLoading={primaryButtonLoading ?? false}
            size={44}
            textColor={theme.colors.white}
            backgroundColor={theme.colors.surfaceBlack}
            alignSelf="stretch"
            variant={primaryButtonMode as any}
            onPress={onPressPrimaryButton}>
            {primaryButtonLabel}
          </Button>
        )}
        {secondaryButtonLabel && (
          <>
            {buttonsLayout === ButtonsLayout.Column && <Spacer paddingTop="m" />}
            {buttonsLayout === ButtonsLayout.Row && <Spacer paddingRight="m" />}
            <Button
              style={buttonsLayout === ButtonsLayout.Row ? styles.inlineButton : undefined}
              isLoading={secondaryButtonLoading ?? false}
              size={44}
              alignSelf="stretch"
              variant={secondaryButtonMode as any}
              onPress={onPressSecondaryButton}>
              {secondaryButtonLabel}
            </Button>
          </>
        )}
      </View>
    );
  }, [
    buttonsLayout,
    onPressPrimaryButton,
    onPressSecondaryButton,
    primaryButtonLabel,
    primaryButtonLoading,
    primaryButtonMode,
    secondaryButtonLabel,
    secondaryButtonLoading,
    secondaryButtonMode,
    styles.buttonsRow,
    styles.inlineButton,
    theme.colors.surfaceBlack,
    theme.colors.white,
  ]);

  return (
    <View style={styles.container}>
      {/* invoke dismiss fn or goBack if user presses the background */}
      <TouchableOpacity
        onPress={onDismiss || goBack}
        activeOpacity={1}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.innerContainer}>
        {image && <Image source={image} style={styles.imageStyle} resizeMode="center" />}
        <Spacer paddingBottom={16}>
          <Typography.Semibold18 style={CommonStyles.textAlign.center}>
            {title}
          </Typography.Semibold18>
        </Spacer>
        <Typography.Regular16 style={[styles.subtitleText, subtitleStyle]}>
          {typeof subtitle === 'string' ? (
            <Trans
              i18nKey={subtitle as any}
              components={[<Typography.Semibold16 style={subtitleStyle} />]}
            />
          ) : (
            subtitle
          )}
        </Typography.Regular16>
        <Spacer paddingTop={theme.spacing.xl} />
        {buttons}
      </View>
    </View>
  );
};

export default ConfirmModal;

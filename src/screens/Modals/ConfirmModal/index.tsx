import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/CustomButton';
// dismiss button
// import {iconCross} from 'assets/images';
import Typography from 'components/Typography';
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
import { useTheme } from 'native-base';
import Spacer from 'components/Spacer';
import CommonStyles from 'config/theme/CommonStyles';
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
  primaryButtonMode?: keyof Pick<React.ComponentProps<typeof Button>, 'variant'>;

  /**
   * The mode of the secondary button.
   * @default text
   */
  secondaryButtonMode?: keyof Pick<React.ComponentProps<typeof Button>, 'variant'>;
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
    },
  } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const theme = useTheme();

  const { goBack } = useNavigation<NavProps['navigation']>();

  const onPressPrimaryButton = () => {
    if (removeModalAfterButtonPress) {
      goBack();
      onPressPrimary && setTimeout(() => onPressPrimary(), 200);
    } else {
      onPressPrimary && onPressPrimary();
    }
  };

  // @ts-ignore
  return (
    <View style={styles.container}>
      {/* invoke dismiss fn or goBack if user presses the background */}
      <TouchableOpacity
        onPress={onDismiss || goBack}
        activeOpacity={1}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.innerContainer}>
        {image && <Image source={image} style={styles.imageStyle} />}

        <Spacer paddingBottom={16}>
          <Typography.H5 style={CommonStyles.textAlign.center}>{title}</Typography.H5>
        </Spacer>

        <Typography.Body5 style={[styles.subtitleText, subtitleStyle]}>
          {typeof subtitle === 'string' ? (
            <Trans
              i18nKey={subtitle as string}
              components={[<Typography.Subtitle2 style={subtitleStyle} />]}
            />
          ) : (
            subtitle
          )}
        </Typography.Body5>

        <Spacer paddingTop={theme.spacing.xl}>
          {primaryButtonLabel && (
            <Button
              size={44}
              textColor={theme.colors.white}
              backgroundColor={theme.colors.surfaceBlack}
              alignSelf="stretch"
              // TODO: fix this properly
              // @ts-ignore
              variant={primaryButtonMode as any}
              onPress={onPressPrimaryButton}>
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButtonLabel && (
            <Spacer paddingTop={theme.spacing.m}>
              <Button
                size={44}
                mb="s"
                alignSelf="stretch"
                variant={secondaryButtonMode as any}
                onPress={onPressSecondary}>
                {secondaryButtonLabel}
              </Button>
            </Spacer>
          )}
        </Spacer>
      </View>
    </View>
  );
};

export default ConfirmModal;

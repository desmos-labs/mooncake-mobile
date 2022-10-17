import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
// dismiss button
// import {iconCross} from 'assets/images';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {ReactNode} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONFIRM_MODAL>;

const ConfirmModal = () => {
  const {
    params: {
      title,
      subtitle,
      primaryButtonLabel,
      secondaryButtonLabel,
      onDismiss,
      onPressPrimary,
      onPressSecondary,
      removeModalAfterButtonPress,
    },
  } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const theme = useTheme();

  const {goBack} = useNavigation<NavProps['navigation']>();

  const onPressPrimaryButton = () => {
    if (removeModalAfterButtonPress) {
      goBack();
      onPressPrimary && setTimeout(() => onPressPrimary());
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
        <Typography.Body5 style={styles.subtitleText}>
          {subtitle}
        </Typography.Body5>
        {primaryButtonLabel && (
          <Button
            style={styles.primaryButton}
            mode="contained"
            onPress={onPressPrimaryButton}>
            {primaryButtonLabel}
          </Button>
        )}
        {secondaryButtonLabel && (
          <Button
            containerStyle={styles.secondaryButton}
            color={theme.colors.surfaceBlack}
            mode="text"
            onPress={onPressSecondary}>
            {secondaryButtonLabel}
          </Button>
        )}
      </View>
    </View>
  );
};

export default ConfirmModal;

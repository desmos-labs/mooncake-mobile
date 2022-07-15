import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {iconCross} from 'assets/images';
import DButton from 'components/DButton';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import useStyles from './useStyles';

export type ConfirmModalParams = {
  /**
   * The title of the modal. This should be the immediate result
   * of whatever the user was doing.
   */
  title?: string;
  /**
   * Additional description for the title.
   */
  subtitle?: string;
  /**
   * Label of the primary button.
   */
  primaryButtonLabel: string;
  /**
   * Label of the secondary button.
   */
  secondaryButtonLabel: string;
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
    },
  } = useRoute<NavProps['route']>();

  const styles = useStyles();

  const {goBack} = useNavigation<NavProps['navigation']>();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss || goBack}>
          <Image style={styles.dismissButtonImage} source={iconCross} />
        </TouchableOpacity>
        <Typography.H5>{title}</Typography.H5>
        <Typography.Body5 style={styles.subtitleText}>
          {subtitle}
        </Typography.Body5>
        <DButton
          style={styles.primaryButton}
          mode="contained"
          onPress={onPressPrimary}>
          <Typography.Subtitle1 style={styles.primaryButtonText}>
            {primaryButtonLabel}
          </Typography.Subtitle1>
        </DButton>
        <DButton
          style={styles.primaryButton}
          mode="text"
          onPress={onPressSecondary}>
          <Typography.Subtitle1 style={styles.secondaryButtonText}>
            {secondaryButtonLabel}
          </Typography.Subtitle1>
        </DButton>
      </View>
    </View>
  );
};

export default ConfirmModal;

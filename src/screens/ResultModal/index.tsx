import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import Typography from 'components/Typography';
import {iconCross, modalSuccess} from 'assets/images';
import DButton from 'components/DButton';
import useStyles from './useStyles';

export type ResultModalParams = {
  /**
   * The title of the modal. This should be the immediate result
   * of whatever the user was doing.
   */
  title?: string;

  /**
   * The image to be shown. It should be related to the result of what the
   * user was doing.
   */
  image?: ImageSourcePropType;

  /**
   * Additional description for the title.
   */
  subtitle?: string;

  /**
   * What to do when the user presses the primary modal button
   */
  primaryButtonLabel: string;

  /**
   * What to do when the user presses the close button.
   */
  onDismiss?: () => void;

  /**
   * What to do when the user presses the primary (main) modal button.
   */
  onPressPrimary?: () => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.RESULT_MODAL>;

const ResultModal = () => {
  const {
    params: {
      title,
      subtitle,
      image,
      primaryButtonLabel,
      onDismiss,
      onPressPrimary,
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
        <Image style={styles.image} source={image || modalSuccess} />
        <Typography.H3>{title}</Typography.H3>
        <Typography.Body1 style={styles.subtitleText}>
          {subtitle}
        </Typography.Body1>
        <DButton
          style={styles.primaryButton}
          mode="contained"
          onPress={onPressPrimary || goBack}>
          <Typography.Subtitle1 style={styles.primaryButtonText}>
            {primaryButtonLabel}
          </Typography.Subtitle1>
        </DButton>
      </View>
    </View>
  );
};

export default ResultModal;

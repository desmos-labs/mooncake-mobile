import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {iconCross, modalSuccess} from 'assets/images';
import Button from 'components/Button';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity, View} from 'react-native';
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
   * Label of the primary button.
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
          hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}
          onPress={onDismiss || goBack}>
          <Image style={styles.dismissButtonImage} source={iconCross} />
        </TouchableOpacity>
        <Typography.H5>{title}</Typography.H5>
        <Image style={styles.image} source={image || modalSuccess} />
        <Typography.Body5 style={styles.subtitleText}>
          {subtitle}
        </Typography.Body5>
        <Button
          style={styles.primaryButton}
          mode="contained"
          onPress={onPressPrimary || goBack}>
          <Typography.Subtitle1 style={styles.primaryButtonText}>
            {primaryButtonLabel}
          </Typography.Subtitle1>
        </Button>
      </View>
    </View>
  );
};

export default ResultModal;

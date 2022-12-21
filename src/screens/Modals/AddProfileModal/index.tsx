import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {addProfileIcon, addNewProfileIcon} from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type AddProfileModalParams = {
  /**
   * What to do when the user presses the first button.
   */
  onPressPrimary: () => void;
  /**
   * What to do when the user presses the second button.
   */
  onPressSecondary: () => void;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ADD_PROFILE_MODAL
>;

const AddProfileModal = () => {
  const {
    params: {onPressPrimary, onPressSecondary},
  } = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('addProfile');
  const {goBack} = useNavigation<NavProps['navigation']>();

  const onPressFirstButton = useCallback(() => {
    goBack();
    setTimeout(() => onPressPrimary && onPressPrimary(), 200);
  }, []);

  const onPressSecondButton = useCallback(() => {
    goBack();
    setTimeout(() => onPressSecondary && onPressSecondary(), 200);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={goBack}
      style={styles.container}>
      {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
      {/* parts of the modal content are pressed */}
      <TouchableOpacity activeOpacity={1} style={styles.innerContainer}>
        <View style={styles.tabIcon} />
        <Typography.H4 style={styles.headerText}>{t('title')}</Typography.H4>
        <Spacer paddingVertical={20}>
          <Divider style={styles.divider} />
          <TouchableOpacity style={styles.button} onPress={onPressFirstButton}>
            <FastImage source={addProfileIcon} style={styles.image} />
            <Typography.Body6>{t('addProfile')}</Typography.Body6>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity style={styles.button} onPress={onPressSecondButton}>
            <FastImage source={addNewProfileIcon} style={styles.image} />
            <Typography.Body6>{t('createNewProfile')}</Typography.Body6>
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </Spacer>
        <Spacer paddingVertical={theme.spacing.s} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AddProfileModal;

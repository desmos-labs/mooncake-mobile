import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { addNewProfileIcon, addProfileIcon } from 'assets/images';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import { Divider, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
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

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ADD_PROFILE_MODAL>;

const AddProfileModal = () => {
  const {
    params: { onPressPrimary, onPressSecondary },
  } = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('addProfile');
  const { goBack } = useNavigation<NavProps['navigation']>();

  const onPressFirstButton = useCallback(() => {
    goBack();
    setTimeout(() => onPressPrimary && onPressPrimary(), 200);
  }, []);

  const onPressSecondButton = useCallback(() => {
    goBack();
    setTimeout(() => onPressSecondary && onPressSecondary(), 200);
  }, []);

  return (
    <BottomUpModalWrapper goBack={goBack}>
      <Typography.H4 style={styles.headerText}>{t('title')}</Typography.H4>
      <Spacer paddingVertical={20}>
        <Divider style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={onPressFirstButton}>
          <Image source={addProfileIcon} style={styles.image} />
          <Typography.Body6>{t('addProfile')}</Typography.Body6>
        </TouchableOpacity>
        <Divider style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={onPressSecondButton}>
          <Image source={addNewProfileIcon} style={styles.image} />
          <Typography.Body6>{t('createNewProfile')}</Typography.Body6>
        </TouchableOpacity>
        <Divider style={styles.divider} />
      </Spacer>
      <Spacer paddingVertical={theme.spacing.s} />
    </BottomUpModalWrapper>
  );
};

export default AddProfileModal;

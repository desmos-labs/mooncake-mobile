import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {addProfileIcon, plusWhiteIcon} from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {GestureDetector} from 'react-native-gesture-handler';
import {Divider, useTheme} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import useModalAnimations from 'screens/Modals/utils/useModalAnimations';
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
  const {panGesture, animatedStyle} = useModalAnimations();

  const onPressFirstButton = useCallback(() => {
    goBack();
    setTimeout(() => onPressPrimary && onPressPrimary(), 200);
  }, []);

  const onPressSecondButton = useCallback(() => {
    goBack();
    setTimeout(() => onPressSecondary && onPressSecondary(), 200);
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={goBack}
        style={styles.container}>
        {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
        {/* parts of the modal content are pressed */}
        <Animated.View style={animatedStyle}>
          <TouchableOpacity activeOpacity={1} style={styles.innerContainer}>
            <View style={styles.tabIcon} />
            <Typography.H4 style={styles.headerText}>
              {t('title')}
            </Typography.H4>
            <Spacer paddingVertical={20}>
              <Divider style={styles.divider} />
              <TouchableOpacity
                style={styles.button}
                onPress={onPressFirstButton}>
                <FastImage
                  source={plusWhiteIcon}
                  style={styles.image}
                  tintColor={theme.colors.butterOrange01}
                />
                <Typography.Body6>{t('add desmos profile')}</Typography.Body6>
              </TouchableOpacity>
              <Divider style={styles.divider} />
              <TouchableOpacity
                style={styles.button}
                onPress={onPressSecondButton}>
                <FastImage source={addProfileIcon} style={styles.image} />
                <Typography.Body6>
                  {t('create a new desmos profile')}
                </Typography.Body6>
              </TouchableOpacity>
              <Divider style={styles.divider} />
            </Spacer>
            <Spacer paddingVertical={theme.spacing.s} />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </GestureDetector>
  );
};

export default AddProfileModal;

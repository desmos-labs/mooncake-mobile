import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RadioButtonInput} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/Feather';
import {ProfileRadioValue} from 'screens/Profiles/components/SettingsProfileBadgeGroup';
import useStyles from './useStyles';

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  /**
   * Values to be displayed as radio buttons.
   */
  value: ProfileRadioValue;
  index: number;
  /**
   * Callback when the user click a button.
   * @param index the values[index] on the clicked button.
   */
  onSelect: (index: number) => void;
  /**
   * Callback when the user click the edit profile button.
   * @param index the values[index] on the clicked button.
   */
  onEditProfile: (index: number) => void;
  /**
   * Callback when the user click the remove profile button.
   * @param index the values[index] on the clicked button.
   */
  onRemoveProfile: (index: number) => void;
}

type ContextType = {
  translateX: number;
};

const SettingsProfileBadge = (props: Props) => {
  const {
    value,
    index,
    onSelect,
    onEditProfile,
    onRemoveProfile,
    simultaneousHandlers,
  } = props;
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('settings');
  const translateX = useSharedValue(0);
  const {width: SCREEN_WIDTH} = Dimensions.get('window');
  const TRANSLATE_X_THRESHOLD1 = -SCREEN_WIDTH * 0.22;
  const TRANSLATE_X_THRESHOLD2 = -SCREEN_WIDTH * 0.46;
  const panGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      if (event.velocityX <= 0) {
        translateX.value = event.translationX + context.translateX;
      }
    },
    onEnd: () => {
      if (
        translateX.value < TRANSLATE_X_THRESHOLD1 &&
        translateX.value > TRANSLATE_X_THRESHOLD2
      ) {
        translateX.value = withTiming(TRANSLATE_X_THRESHOLD1);
      } else if (translateX.value < TRANSLATE_X_THRESHOLD2) {
        translateX.value = withTiming(TRANSLATE_X_THRESHOLD2);
      } else {
        translateX.value = withTiming(0);
      }
    },
    onCancel: () => {
      translateX.value = withTiming(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  return (
    <View>
      <TouchableOpacity
        style={styles.firstBox}
        onPress={() => onEditProfile(index)}>
        <Icon
          name="edit"
          size={26}
          style={{alignSelf: 'center'}}
          color={theme.colors.accentBlue01}
        />
        <Typography.Subtitle4
          style={{color: theme.colors.accentBlue01, textAlign: 'center'}}>
          {t('edit')}
        </Typography.Subtitle4>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondBox}
        onPress={() => onRemoveProfile(index)}>
        <Icon
          name="trash-2"
          size={26}
          style={{alignSelf: 'center'}}
          color={theme.colors.pink01}
        />
        <Typography.Subtitle4
          style={{color: theme.colors.pink01, textAlign: 'center'}}>
          {t('remove')}
        </Typography.Subtitle4>
      </TouchableOpacity>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity activeOpacity={1} onPress={() => onSelect(index)}>
            <DropShadowWrapper
              style={styles.externalContainer}
              innerStyle={styles.container}>
              <FastImage
                source={value.profilePicture}
                style={styles.profilePicture}
              />
              <View style={styles.textContainer}>
                <Typography.H5>{value.nickname}</Typography.H5>
                <Typography.Body6>{value.dTag}</Typography.Body6>
              </View>
              <View style={styles.radioButton}>
                <RadioButtonInput
                  obj={value}
                  index={index}
                  isSelected={value.isSelected}
                  onPress={() => onSelect(index)}
                  buttonSize={12}
                  // @ts-ignore
                  borderWidth={2}
                  buttonInnerColor={theme.colors.butterOrange01}
                  buttonOuterColor={theme.colors.butterOrange01}
                />
              </View>
            </DropShadowWrapper>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default SettingsProfileBadge;

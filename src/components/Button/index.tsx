import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Image, ImageSource } from 'expo-image';
import { useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { ActivityIndicator, Platform, Pressable, PressableProps, View } from 'react-native';
import Reanimated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import {
  ImageStyle as RNImageStyle,
  TextStyle,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import useStyles from './useStyles';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

/**
 * Button type
 * @type {('solid' | 'outline' | 'text' | 'elevated')}
 */
type BButtonType = 'solid' | 'outline' | 'text' | 'elevated';

export interface Props extends PressableProps {
  height?: 72 | 52 | 44 | 32;
  type?: BButtonType;
  children: React.ReactNode;
  leftIcon?: ImageSource;
  leftIconStyle?: RNImageStyle;
  rightIcon?: ImageSource;
  rightIconStyle?: RNImageStyle;
  loading?: boolean;
  loadingColor?: string;
  radius?: number;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Button component
 * @constructor
 */
const Button = (props: Props) => {
  const styles = useStyles(props);
  const theme = useTheme();
  const {
    type = 'solid',
    children,
    leftIcon,
    rightIcon,
    leftIconStyle,
    rightIconStyle,
    disabled,
    style,
    loading,
    loadingColor,
    textStyle,
    ...rest
  } = props;

  const buttonStyle = useMemo(() => {
    const styleMap: { [index: string]: any } = {
      solid: {
        backgroundColor: '#25282D',
      },
      outline: {
        borderWidth: 1,
        borderColor: '#25282D',
      },
      text: {
        borderWidth: 0,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
      },
      elevated: {
        backgroundColor: theme.colors.background,
        shadowColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(10, 10, 10, 0.5)',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 20,

        elevation: 10,
      },
    };
    return styleMap[type as string];
  }, [theme.colors.background, type]);

  const defaultLoadingColor = React.useMemo(() => {
    switch (type) {
      case 'text':
      case 'outline':
      case 'elevated':
        return '#25282D';
      default:
        return theme.colors.white;
    }
  }, [theme.colors.white, type]);

  const defaultTextStyle = React.useMemo(() => {
    switch (type) {
      case 'outline':
      case 'text':
        return CommonStyles.textBlack;
      default:
        return CommonStyles.textWhite;
    }
  }, [type]);

  // Reanimated
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: buttonScale.value }],
      opacity: disabled ? 0.5 : interpolate(buttonScale.value, [0.9, 1], [0.5, 1]),
    }),
    [disabled],
  );

  return (
    <ReanimatedPressable
      disabled={disabled}
      style={[animatedButtonStyle, styles.root, buttonStyle, disabled && styles.disabled, style]}
      onPressIn={() => {
        buttonScale.value = withTiming(0.9, { duration: 200 });
      }}
      onPressOut={() => {
        buttonScale.value = withTiming(1, { duration: 200 });
      }}
      {...rest}>
      <View style={styles.innerView}>
        {loading ? (
          <ActivityIndicator color={loadingColor || defaultLoadingColor} />
        ) : (
          <>
            {leftIcon && <Image source={leftIcon} style={[styles.icon, leftIconStyle!]} />}
            {typeof children === 'string' ? (
              <Typography.Semibold16 style={[defaultTextStyle, textStyle]}>
                {children}
              </Typography.Semibold16>
            ) : (
              children
            )}
            {rightIcon && <Image source={rightIcon} style={[styles.icon, rightIconStyle!]} />}
          </>
        )}
      </View>
    </ReanimatedPressable>
  );
};

export default Button;

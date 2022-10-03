import MaskedView from '@react-native-masked-view/masked-view';
import React, {ElementType, ReactNode} from 'react';
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, useTheme} from 'react-native-paper';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import useStyles from './useStyles';

export type Props = {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline (low emphasis)
   * - `outlined` - button with an outline (medium emphasis)
   * - `contained` - button with a background color and elevation shadow (high emphasis)
   * - `gradient` - button with a gradient filled background color
   * - `gradientFilled` - button with a gradient filled background color
   * - `backgroundComponent` - button with a react component filled as background
   */
  mode?:
    | 'text'
    | 'outlined'
    | 'contained'
    | 'gradient'
    | 'gradientFilled'
    | 'backgroundComponent';
  /**
   * Custom text color for flat button,
   * or background color for contained button.
   */
  color?: string;
  /**
   * Icon to display for the `Button`.
   */
  icon?: IconSource;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Style for the button text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Whether the button is disabled.
   * A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * If tru display the button with the accent color from the current1 theme.
   */
  accent?: boolean;
  /**
   * Modify the container wrapping the children prop. Has no effect for text mode.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Modify the container wrapping the gradient button. Has no effect for other modes.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * [mode: backgroundComponent]
   * Use this component to fill the button background.
   * Has no effect for other modes.
   */
  BackgroundComponent?: ElementType;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const MaterialButton: React.FC<Props> = props => {
  const {
    mode,
    color,
    icon,
    onPress,
    labelStyle,
    loading,
    disabled,
    accent,
    contentStyle,
    style,
    containerStyle,
    BackgroundComponent,
    children,
  } = props;
  const theme = useTheme();
  const styles = useStyles(props);
  const accentColor = accent ? theme.colors.accent : theme.colors.primary;

  // unlike the other modes, the clickable area for text-mode is only where
  // the text is rendered
  if (mode === 'text') {
    return (
      <TouchableOpacity
        disabled={disabled}
        style={[
          {alignSelf: 'center'},
          styles.btnStyle,
          style,
          disabled && styles.disabledStyle,
        ]}
        onPress={onPress}>
        <Text style={[styles.labelStyle, labelStyle]}>{children}</Text>
      </TouchableOpacity>
    );
  }

  if (mode === 'gradient') {
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          disabled && styles.disabledStyle,
        ]}>
        <MaskedView
          style={styles.maskedView}
          maskElement={
            <View style={styles.maskingContainer}>
              <View style={styles.masking} />
            </View>
          }>
          <LinearGradient
            style={styles.linearGradient}
            colors={[
              'rgba(255, 199, 91, 1)',
              'rgba(255, 132, 79, 1)',
              'rgba(255, 132, 79, 1)',
              'rgba(255, 132, 79, 1)',
            ]}
          />
        </MaskedView>
        <Button
          icon={icon}
          color={color || accentColor}
          onPress={onPress}
          mode="outlined"
          labelStyle={[styles.labelStyle, labelStyle]}
          style={[styles.btnStyle, style]}
          contentStyle={[styles.contentStyle, contentStyle]}
          loading={loading}
          disabled={disabled}>
          {children}
        </Button>
      </View>
    );
  }

  if (mode === 'gradientFilled') {
    return (
      <View
        style={[
          styles.gradientFilledContainer,
          containerStyle,
          disabled && styles.disabledStyle,
        ]}>
        <LinearGradient
          style={[styles.maskedView, styles.linearGradient]}
          colors={theme.colors.butterYellowGradient}
        />
        <Button
          icon={icon}
          color={color || accentColor}
          onPress={onPress}
          mode="outlined"
          labelStyle={[styles.labelStyle, labelStyle]}
          style={[styles.btnStyle, style]}
          contentStyle={[styles.contentStyle, contentStyle]}
          loading={loading}
          disabled={disabled}>
          {children}
        </Button>
      </View>
    );
  }

  if (mode === 'backgroundComponent') {
    // TouchableOpacity in FlatList causing 'Excessive number of pending callbacks: 501. Some pending callbacks that might have leaked by never being called from native code:' ...startAnimatingNode...{}
    return (
      <Pressable onPress={onPress} style={pressableFeedback}>
        <View style={[styles.backgroundComponentButton, style]}>
          {!!BackgroundComponent && (
            <BackgroundComponent
              style={styles.backgroundComponent}
              width={styles.backgroundComponent.width}
              height={styles.backgroundComponent.height}
            />
          )}
          {children}
        </View>
      </Pressable>
    );
  }

  return (
    <Button
      icon={icon}
      color={color || accentColor}
      onPress={onPress}
      mode={mode}
      labelStyle={[styles.labelStyle, labelStyle]}
      style={[styles.btnStyle, style]}
      contentStyle={[styles.contentStyle, contentStyle]}
      loading={loading}
      disabled={disabled}>
      {children}
    </Button>
  );
};

function pressableFeedback({
  pressed,
}: PressableStateCallbackType): StyleProp<ViewStyle> {
  if (!pressed) return {};
  return {opacity: 0.75, transform: [{scale: 1.05}]};
}

export default MaterialButton;

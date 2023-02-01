import React from 'react';
import {Pressable, View} from 'react-native';
import {ButtonProps} from 'components/Button';
import Typography from 'components/Typography';

interface Props extends ButtonProps {
  styleMap: any;
  sizeMap: any;
  styles: any;
  theme: ReactNativePaper.Theme;
}

const AndroidButton = ({
  mode,
  size,
  backgroundColor,
  textColor,
  children,
  additionalStyle,
  sizeMap,
  styleMap,
  styles,
  theme,
  ...rest
}: Props) => {
  return (
    <View style={styles.pressableView}>
      <Pressable
        android_ripple={{
          color: theme.colors.butterOrange01,
          foreground: true,
        }}
        style={[
          styles.button,
          styleMap[mode],
          sizeMap[size],
          {backgroundColor},
          additionalStyle,
        ]}
        {...rest}>
        <Typography.Button2
          numberOfLines={1}
          style={{color: textColor || theme.colors.surfaceBlack}}>
          {children}
        </Typography.Button2>
      </Pressable>
    </View>
  );
};

export default AndroidButton;

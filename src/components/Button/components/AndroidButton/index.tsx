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
  useSubtitle,
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
          color: theme.colors.white,
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
        {useSubtitle ? (
          <Typography.Subtitle2
            numberOfLines={1}
            style={{color: textColor || theme.colors.surfaceBlack}}>
            {children}
          </Typography.Subtitle2>
        ) : (
          <Typography.Button2
            numberOfLines={1}
            style={{color: textColor || theme.colors.surfaceBlack}}>
            {children}
          </Typography.Button2>
        )}
      </Pressable>
    </View>
  );
};

export default AndroidButton;

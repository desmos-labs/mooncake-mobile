import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { ButtonProps } from 'components/Button';
import Typography from 'components/Typography';

interface Props extends ButtonProps {
  styleMap: any;
  sizeMap: any;
  styles: any;
  theme: any;
}

const IOSButton = ({
  mode,
  size,
  backgroundColor,
  textColor,
  children,
  additionalStyle,
  disabled,
  loading,
  useSubtitle,
  sizeMap,
  styleMap,
  styles,
  theme,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        styleMap[mode],
        sizeMap[size],
        { backgroundColor },
        additionalStyle,
        disabled ? styles.disabled : {},
      ]}
      {...rest}>
      <View style={{ flexDirection: 'row' }}>
        {useSubtitle ? (
          <Typography.Subtitle2
            numberOfLines={1}
            style={{ color: textColor || theme.colors.surfaceBlack }}>
            {children}
          </Typography.Subtitle2>
        ) : (
          <Typography.Button2
            numberOfLines={1}
            style={{ color: textColor || theme.colors.surfaceBlack }}>
            {children}
          </Typography.Button2>
        )}
        {loading ? (
          <ActivityIndicator
            size="small"
            color={textColor}
            style={{ marginLeft: theme.spacing.m }}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default IOSButton;

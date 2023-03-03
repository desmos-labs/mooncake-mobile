import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { ButtonProps } from 'components/Button';
import Typography from 'components/Typography';
import NamedStyles = StyleSheet.NamedStyles;

interface Props extends ButtonProps {
  styleMap: any;
  sizeMap: any;
  styles: NamedStyles<any>;
  theme: ReactNativePaper.Theme;
}

const GenericButton = ({
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
    <View style={styles.pressableView}>
      <Pressable
        style={[
          styles.button,
          styleMap[mode],
          sizeMap[size],
          { backgroundColor },
          additionalStyle,
          disabled ? styles.disabled : {},
        ]}
        {...rest}>
        <View style={styles.flexRow}>
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
      </Pressable>
    </View>
  );
};

export default GenericButton;

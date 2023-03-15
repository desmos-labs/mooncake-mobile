import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { ButtonProps } from 'components/Button';
import Typography from 'components/Typography';
import useStyles from 'components/Button/useStyles';
import { useTheme } from 'native-base';

interface Props extends ButtonProps {
  styleMap: { [index: string]: any };
  sizeMap: { [index: string]: any };
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
  ...rest
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.pressableView}>
      <Pressable
        android_ripple={{ color: 'rgba(255, 255, 255, 0.6)' }}
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

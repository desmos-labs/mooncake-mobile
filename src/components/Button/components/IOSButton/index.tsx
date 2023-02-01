import React from 'react';
import {TouchableOpacity} from 'react-native';
import {ButtonProps} from 'components/Button';
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
        {backgroundColor},
        additionalStyle,
        disabled ? styles.disabled : {},
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
    </TouchableOpacity>
  );
};

export default IOSButton;

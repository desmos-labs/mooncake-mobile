import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'native-base';
import { baseSpacing } from 'config/theme/LightTheme';

export type SpacingKey = keyof typeof baseSpacing;

type Props = {
  children?: React.ReactNode;
  padding?: number | string | SpacingKey | undefined;
  paddingBottom?: number | string | SpacingKey | undefined;
  paddingHorizontal?: number | string | SpacingKey | undefined;
  paddingLeft?: number | string | SpacingKey | undefined;
  paddingRight?: number | string | SpacingKey | undefined;
  paddingTop?: number | string | SpacingKey | undefined;
  paddingVertical?: number | string | SpacingKey | undefined;
};

const SpacingKeys: SpacingKey[] = ['xs', 's', 'm', 'l', 'xl'];

/**
 * HOC that wraps a child component with optional padding to create space
 * between sibling components.
 * @deprecated Consider using the layout props from native-base components.
 */
const Spacer = ({ children, ...rest }: Props) => {
  const theme = useTheme();
  const style = React.useMemo(() => {
    const copy = { ...rest };

    Object.keys(copy).forEach(k => {
      const obkectKey = k as keyof typeof copy;
      // If the provided value is a spacing key then replace the value with
      // the defined size from the theme.
      if (SpacingKeys.indexOf(copy[obkectKey] as any) !== -1) {
        const spacingKey = copy[obkectKey] as SpacingKey;
        copy[obkectKey] = theme.spacing[spacingKey];
      }
    });
    return copy;
  }, [theme, rest]);

  return <View style={style}>{children}</View>;
};

export default Spacer;

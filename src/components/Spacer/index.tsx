import { useTheme } from '@react-navigation/native';
import { ExtendedTheme } from 'config/theme/customTheme';
import React from 'react';
import { View } from 'react-native';

type ThemeSpacing = keyof ExtendedTheme['spacings'];
const ThemSpacingKeys: ThemeSpacing[] = ['xs', 's', 'sm', 'm', 'ml', 'l', 'xl', 'xxl'];

type Props = {
  children?: React.ReactNode;
  padding?: number | ThemeSpacing | string | undefined;
  paddingBottom?: number | ThemeSpacing | string | undefined;
  paddingHorizontal?: number | ThemeSpacing | string | undefined;
  paddingLeft?: number | ThemeSpacing | string | undefined;
  paddingRight?: number | ThemeSpacing | string | undefined;
  paddingTop?: number | ThemeSpacing | string | undefined;
  paddingVertical?: number | ThemeSpacing | string | undefined;
};

/**
 * HOC that wraps a child component with optional padding to create space
 * between sibling components.
 */
const Spacer = ({ children, ...rest }: Props) => {
  const theme = useTheme();

  const patchedRest = React.useMemo(() => {
    const patched = { ...rest };
    Object.keys(patched)
      .filter(k => k.indexOf('padding') === 0)
      .forEach(k => {
        // Safe to ignore there k is a key of patched, since we are iterating over the keys of patched.
        // @ts-ignore
        if (ThemSpacingKeys.indexOf(patched[k]) !== -1) {
          // Safe to ignore here patched[k] is a ThemeSpacing, guaranteed from the above if.
          // @ts-ignore
          const spacingKey = patched[k] as ThemeSpacing;
          // Safe to ignore, patched[k] will receive as a padding field a value of space
          // from the theme.spacings object.
          // @ts-ignore
          patched[k] = theme.spacings[spacingKey];
        }
      });
    return patched;
  }, [rest, theme.spacings]);

  // @ts-ignore
  return <View style={patchedRest}>{children}</View>;
};

export default Spacer;

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ICustomTheme, useTheme } from 'native-base';
import NamedStyles = StyleSheet.NamedStyles;

export function makeStyle<T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (theme: ICustomTheme) => T,
): () => T {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(styleProvider(theme));
  };
}

export function makeStyleWithProps<P, T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (props: P, theme: ICustomTheme) => T,
): (props: P) => T {
  return (props: P) => {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(styleProvider(props, theme)), [props, theme]);
  };
}

export const addAlphaToHex = (color: string, opacity: number) => {
  // coerce values so it is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};

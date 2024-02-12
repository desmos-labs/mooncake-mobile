import { useTheme } from '@react-navigation/native';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme } from './customTheme';
import NamedStyles = StyleSheet.NamedStyles;

export function makeStyle<T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (theme: ExtendedTheme) => T,
): () => T {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(styleProvider(theme));
  };
}

export function makeStyleWithProps<P, T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (props: P, theme: ExtendedTheme) => T,
): (props: P) => T {
  return (props: P) => {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(styleProvider(props, theme)), [props, theme]);
  };
}

import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Theme} from 'react-native-paper/lib/typescript/types';
import NamedStyles = StyleSheet.NamedStyles;

export function makeStyle<T extends NamedStyles<T> | NamedStyles<any>>(
  // eslint-disable-next-line no-unused-vars
  styleProvider: (theme: ReactNativePaper.Theme) => T,
): () => T {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(styleProvider(theme));
  };
}

export function makeStyleWithProps<
  P,
  T extends NamedStyles<T> | NamedStyles<any>,
>(
  // eslint-disable-next-line no-unused-vars
  styleProvider: (props: P, theme: ReactNativePaper.Theme) => T,
  // eslint-disable-next-line no-unused-vars
): (props: P) => T {
  return (props: P) => {
    const theme = useTheme();
    return useMemo(
      () => StyleSheet.create(styleProvider(props, theme)),
      [props, theme],
    );
  };
}

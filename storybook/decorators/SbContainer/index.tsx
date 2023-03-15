import React, {ReactNode} from 'react';
import {Switch, ColorValue, View, Text} from 'react-native';
import {useMMKVBoolean} from 'react-native-mmkv';
import { SafeAreaProvider } from "react-native-safe-area-context";
import {NativeBaseProvider} from "native-base";
import customTheme from "config/theme/CustomTheme";

interface Props {
  children?: ReactNode;
  justifyContent?: any;
  alignItems?: any;
  padding?: number;
  backgroundColor?: ColorValue;
}

/**
 * Decorator to selectively align components horizontally, vertically, and apply padding.
 */
const SbContainer: React.FC<Props> = ({
  backgroundColor,
  justifyContent,
  alignItems,
  padding,
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useMMKVBoolean('SB_isDarkMode');

  // hacky way to use dark/light themes as this call is not inside the PaperProvider
  // but this is fine, as it is only used to control the background color of the
  // container view
  // However, it should be used sparingly.
  // TODO implement dark mode for native base
  const theme = isDarkMode? customTheme : customTheme;

  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <View
          style={{
            flex: 1,
            justifyContent,
            alignItems,
            padding,
            backgroundColor: backgroundColor
              ? backgroundColor
              : theme.colors.background,
          }}>
          {children}
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              bottom: 4,
              left: 0,
              right: 0,
            }}>
            <Text
              style={{
                color: theme.colors.surfaceBlack,
              }}>
              {`Theme: ${isDarkMode ? 'Dark' : 'Light'}`}
            </Text>
            <Switch
              style={{
                alignSelf: 'center',
              }}
              value={isDarkMode}
              onValueChange={() => setIsDarkMode(!isDarkMode)}
            />
          </View>
        </View>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};

export default SbContainer;

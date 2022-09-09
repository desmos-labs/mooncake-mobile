import React, {ReactNode} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import DarkTheme from 'config/theme/DarkTheme';
import LightTheme from 'config/theme/LightTheme';
import {Switch, ColorValue, View, Text} from 'react-native';
import {useMMKVBoolean} from 'react-native-mmkv';

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
  const theme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={isDarkMode ? DarkTheme : LightTheme}>
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
    </PaperProvider>
  );
};

export default SbContainer;

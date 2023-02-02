import React from 'react';
import { useTheme } from 'react-native-paper';
import { View } from 'react-native';

/**
 * A simple line for use as a separator in FlatLists
 */
const FlatListSeparator = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: theme.colors.grey01,
      }}
    />
  );
};

export default FlatListSeparator;

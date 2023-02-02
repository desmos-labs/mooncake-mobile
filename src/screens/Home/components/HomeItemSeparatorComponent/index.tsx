import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

const HomeItemSeparatorComponent = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        height: 1,
        paddingHorizontal: -theme.spacing.l,
        backgroundColor: theme.colors.dividerGrey,
        marginVertical: theme.spacing.m,
      }}
    />
  );
};

export default HomeItemSeparatorComponent;

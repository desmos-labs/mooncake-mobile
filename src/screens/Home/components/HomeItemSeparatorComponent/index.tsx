import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

const HomeItemSeparatorComponent = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        paddingHorizontal: -theme.spacings.l,
        backgroundColor: theme.colors.neutralVariants['200'],
        marginVertical: theme.spacings.m,
        height: 1,
      }}
    />
  );
};

export default HomeItemSeparatorComponent;

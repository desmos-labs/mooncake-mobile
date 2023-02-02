import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

const ItemSeparatorComponent = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        // padding won't work for some reason
        marginHorizontal: theme.spacing.m,
        height: 1,
        backgroundColor: theme.colors.surfaceGrey,
        marginVertical: theme.spacing.m,
      }}
    />
  );
};

export default ItemSeparatorComponent;

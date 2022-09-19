import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';

const ItemSeparatorComponent = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        alignSelf: 'center',
        width: '85%',
        height: 1,
        backgroundColor: theme.colors.surfaceGrey,
        marginVertical: theme.spacing.m,
      }}
    />
  );
};

export default ItemSeparatorComponent;

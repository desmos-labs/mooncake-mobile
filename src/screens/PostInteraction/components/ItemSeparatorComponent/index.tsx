import { makeStyle } from 'config/theme';
import React from 'react';
import { View } from 'react-native';

const ItemSeparatorComponent = () => {
  const styles = useStyles();
  return <View style={styles.root} />;
};

const useStyles = makeStyle(theme => {
  return {
    root: {
      height: 1,
      backgroundColor: theme.colors.neutral['200'],
      right: -16,
      left: 56,
    },
  };
});

export default ItemSeparatorComponent;

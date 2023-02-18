import React from 'react';
import { View } from 'react-native';
import useStyles from './useStyles';

const ItemSeparator = () => {
  const styles = useStyles();
  return <View style={styles.itemSeparator} />;
};

export default ItemSeparator;

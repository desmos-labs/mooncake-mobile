import { makeStyle } from 'config/theme';
import React from 'react';
import { View, ViewProps } from 'react-native';

const Divider = (props: ViewProps) => {
  const styles = useStyles();
  return <View style={styles.divider} {...props} />;
};

const useStyles = makeStyle(theme => ({
  divider: { flex: 1, borderWidth: 0.5, borderColor: theme.colors.neutralVariants['300'] },
}));

export default Divider;

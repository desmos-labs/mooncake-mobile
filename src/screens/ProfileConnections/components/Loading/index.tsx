import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import useStyles from './useStyles';

/**
 * Component that renders a loading indicator.
 * @constructor
 */
const Loading = () => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator color={theme.colors.surfaceBlack} />
    </View>
  );
};

export default Loading;

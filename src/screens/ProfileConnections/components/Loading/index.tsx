import React from 'react';
import { View } from 'react-native';
import { Spinner, useTheme } from 'native-base';
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
      <Spinner color={theme.colors.surfaceBlack} />
    </View>
  );
};

export default Loading;

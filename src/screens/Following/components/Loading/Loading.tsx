import React, {FC} from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import useStyles from './useStyles';

/**
 * It returns a View component with an ActivityIndicator component inside
 * @returns A React component that displays a loading indicator.
 */
const Loading: FC = () => {
  const styles = useStyles();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
};

export default Loading;

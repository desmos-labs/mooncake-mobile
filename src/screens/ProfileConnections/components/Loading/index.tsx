import StyledSpinner from 'components/StyledSpinner';
import React from 'react';
import { View } from 'react-native';

/**
 * Component that renders a loading indicator.
 * @constructor
 */
const Loading = () => {
  return (
    <View>
      <StyledSpinner />
    </View>
  );
};

export default Loading;

import React from 'react';
import { ActivityIndicator } from 'react-native';

interface Props extends React.ComponentProps<typeof ActivityIndicator> {}

/**
 * A pre-styled spinner with default props to show app activity during async operations.
 */
const StyledSpinner = ({ color = 'black', size = 16, ...rest }: Props) => {
  return <ActivityIndicator color={color} size={size} {...rest} />;
};

export default StyledSpinner;

import React from 'react';
import { Spinner } from 'native-base';

interface Props extends React.ComponentProps<typeof Spinner> {}

/**
 * A pre-styled spinner with default props to show app activity during async operations.
 */
const StyledSpinner = ({ color = 'surfaceBlack', size = 16, ...rest }: Props) => {
  return <Spinner color={color} size={size} {...rest} />;
};

export default StyledSpinner;

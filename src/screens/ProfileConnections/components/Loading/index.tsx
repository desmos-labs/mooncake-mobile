import React from 'react';
import { Center } from 'native-base';
import StyledSpinner from 'components/StyledSpinner';

/**
 * Component that renders a loading indicator.
 * @constructor
 */
const Loading = () => {
  return (
    <Center flexGrow={1} backgroundColor="white" py="50px">
      <StyledSpinner />
    </Center>
  );
};

export default Loading;

import React from 'react';

import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {Alert} from 'react-native';
import AddressCopy from './index';

type CompProps = React.ComponentProps<typeof AddressCopy>;

const defaultProps: CompProps = {
  address: 'desmos1sytfgjh8cytfgjh8cytfgjh8cytfgjh8cytfgjh8c832ts',
};

const withExternalCallback: CompProps = {
  ...defaultProps,

  externalCallback: () =>
    Alert.alert('externalCallback', 'Text has been copied'),
};

storiesOf('components/AddressCopy', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <AddressCopy {...defaultProps} />)
  .add('with external callback', () => (
    <AddressCopy {...withExternalCallback} />
  ));

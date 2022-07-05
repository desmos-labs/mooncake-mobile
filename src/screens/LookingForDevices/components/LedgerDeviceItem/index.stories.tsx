import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {action} from '@storybook/addon-actions';
import LedgerDeviceItem from './index';

type LedgerDeviceItemProps = React.ComponentProps<typeof LedgerDeviceItem>;

const defaultProps: LedgerDeviceItemProps = {
  name: 'Nano X B6E3',
  onPress: action('onPress'),
};

storiesOf('components/LedgerDeviceItem', module)
  .addDecorator(stories => (
    <SbContainer justifyContent="center" padding={8}>
      {stories()}
    </SbContainer>
  ))
  .add('default', () => <LedgerDeviceItem {...defaultProps} />);

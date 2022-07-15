import React from 'react';
import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import ChainLinkItem from './index';

type CompProps = React.ComponentProps<typeof ChainLinkItem>;

const defaultProps: CompProps = {
  chainName: 'cosmos',
  address: 'cosmo1231231alskdjf;laksdjfakl23123123123',
  onPressDisconnect: action('onPressDisconnect'),
  showSnackBar: action('showSnackBar'),
};

storiesOf('components/ChainLinkItem', module)
  .addDecorator(getStories => (
    <SbContainer padding={16} justifyContent="center">
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <ChainLinkItem {...defaultProps} />);

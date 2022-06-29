import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {action} from '@storybook/addon-actions';
import MnemonicWordBadge from './index';

type CompProps = React.ComponentProps<typeof MnemonicWordBadge>;

const PlaceholderMnemonic: CompProps = {
  onPress: action('onPressMnemonic'),
  index: 1,
  value: 'Matrix',
};

storiesOf('components/MnemonicWordBadge', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <MnemonicWordBadge {...PlaceholderMnemonic} />);

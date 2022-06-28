import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import MnemonicGrid from './index';

type CompProps = React.ComponentProps<typeof MnemonicGrid>;

const Mnemonic: CompProps = {
  mnemonic:
    'Twirly Matrices Service Fat Dentists Twirly Matrices Service Fat Dentists Twirly Matrices Service Fat',
};

storiesOf('components/MnemonicGrid', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <MnemonicGrid {...Mnemonic} />);

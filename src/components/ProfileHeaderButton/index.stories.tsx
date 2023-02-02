import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import ProfileHeaderButton from './index';

type CompProps = React.ComponentProps<typeof ProfileHeaderButton>;

const defaultProps: CompProps = {
  imageSrc: { uri: 'https://i.imgur.com/aih9snA.png' },

  onPress: action('onPress'),
};

storiesOf('components/ProfileHeaderButton', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('Default', () => <ProfileHeaderButton {...defaultProps} />);

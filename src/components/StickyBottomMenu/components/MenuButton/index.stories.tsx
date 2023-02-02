import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { action } from '@storybook/addon-actions';
import { commentIcon } from 'assets/images';
import MenuButton from './index';

type CompProps = React.ComponentProps<typeof MenuButton>;

const StandardProps: CompProps = {
  onPress: action('onPress'),

  interactionCount: 100,

  icon: commentIcon,
};

storiesOf('components/MenuButton', module)
  .addDecorator(getStories => (
    <SbContainer alignItems="center" justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('MenuButton', () => <MenuButton {...StandardProps} />);

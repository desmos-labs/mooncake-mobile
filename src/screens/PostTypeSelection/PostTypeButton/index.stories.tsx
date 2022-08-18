import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {action} from '@storybook/addon-actions';
import PostTypeButton from './index';

type CompProps = React.ComponentProps<typeof PostTypeButton>;

const defaultProps: CompProps = {
  type: 'image',
  handlePress: action('handlePress'),
};

storiesOf('components/PostTypeButton', module)
  .addDecorator(s => (
    <SbContainer alignItems="center" justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <PostTypeButton {...defaultProps} />);

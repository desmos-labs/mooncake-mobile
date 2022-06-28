import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import DTextInput from './index';

type CompProps = React.ComponentProps<typeof DTextInput>;

const InputError: CompProps = {
  error: true,
};

// DTextInput as in Desmos TextInput
storiesOf('components/DTextInput', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <DTextInput />)
  .add('Error', () => <DTextInput {...InputError} />);

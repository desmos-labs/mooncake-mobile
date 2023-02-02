import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import TextCounter from './index';

type CompProps = React.ComponentProps<typeof TextCounter>;

const StandardProps: CompProps = {
  textToCount: 'hello i am some text',

  maxChar: 100,
};

storiesOf('components/TextCounter', module)
  .addDecorator(getStories => (
    <SbContainer alignItems="center" justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('TextCounter', () => <TextCounter {...StandardProps} />);

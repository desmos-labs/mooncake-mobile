import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import FlatListSeparator from './index';

// it's just a line, bro
storiesOf('components/DButton', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center">{getStories()}</SbContainer>
  ))
  .add('Default', () => <FlatListSeparator />);

import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import {storiesOf} from '@storybook/react-native';
import FakeDropShadow from './index';

storiesOf('components/FakeDropShadow', module)
  .addDecorator(s => <SbContainer justifyContent="center">{s()}</SbContainer>)
  .add('default', () => <FakeDropShadow />);

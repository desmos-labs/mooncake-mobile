import React from 'react';

import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {action} from '@storybook/addon-actions';
import PostTypeTab from './index';

storiesOf('components/PostTypeTab', module)
  .addDecorator(s => <SbContainer>{s()}</SbContainer>)
  .add('Default', () => {
    return (
      <PostTypeTab
        selectedIndex={0}
        setSelectedIndex={action('setSelectedIndex')}
      />
    );
  });

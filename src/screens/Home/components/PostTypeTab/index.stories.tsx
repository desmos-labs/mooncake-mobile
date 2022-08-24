import React from 'react';

import i18next from 'i18next';

import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import PostTypeTab from './index';

const RenderDefault = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <PostTypeTab
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      postTypes={[
        i18next.t('home:DISCOVER_POSTS'),
        i18next.t('home:FOLLOWING_POSTS'),
      ]}
    />
  );
};

const RenderMoreThan2 = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <PostTypeTab
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      postTypes={[
        i18next.t('home:DISCOVER_POSTS'),
        i18next.t('home:FOLLOWING_POSTS'),
        'THIRD TYPE',
      ]}
    />
  );
};

storiesOf('components/InteractionSwitch', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('Default', () => <RenderDefault />)
  .add('More than 2 tabs', () => <RenderMoreThan2 />);

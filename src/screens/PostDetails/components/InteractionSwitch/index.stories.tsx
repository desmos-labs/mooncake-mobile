import React from 'react';

import i18next from 'i18next';

import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import InteractionSwitch from './index';

const RenderDefault = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <InteractionSwitch
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      sections={[
        {sectionName: i18next.t('home:DISCOVER_POSTS'), counter: 10},
        {sectionName: i18next.t('home:FOLLOWING_POSTS'), counter: 5},
      ]}
    />
  );
};

const RenderMoreThan2 = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <InteractionSwitch
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      sections={[
        {sectionName: i18next.t('home:DISCOVER_POSTS'), counter: 10},
        {sectionName: i18next.t('home:FOLLOWING_POSTS'), counter: 5},
        {sectionName: i18next.t('home:FOLLOWING_POSTS'), counter: 2},
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

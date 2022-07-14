import React from 'react';

import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import ContentTab from './index';

const RenderDefault = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <ContentTab
      selectedIndex={selectedIndex}
      handleTabPressed={setSelectedIndex}
      tabs={['Tab1', 'Tab2']}
    />
  );
};

storiesOf('components/ContentTab', module)
  .addDecorator(s => <SbContainer justifyContent="center">{s()}</SbContainer>)
  .add('default', () => <RenderDefault />);

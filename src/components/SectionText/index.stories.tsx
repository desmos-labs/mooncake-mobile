import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import SectionText from './index';

type CompProps = React.ComponentProps<typeof SectionText>;

const StandardProps: CompProps = {
  leftText: 'Left side',
  rightText: 'Right side',
};

storiesOf('components/Section', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Section text', () => <SectionText {...StandardProps} />);

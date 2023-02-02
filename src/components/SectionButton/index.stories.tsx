import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import SectionButton from './index';

type CompProps = React.ComponentProps<typeof SectionButton>;

const SectionButtonStandardProps: CompProps = {
  label: 'Section button',
};

const SectionButtonCustomLeftIconProps: CompProps = {
  label: 'Section button',
  rightIconName: 'home',
};

storiesOf('components/Section', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Section buttons', () => (
    <>
      <SectionButton {...SectionButtonStandardProps} />
      <SectionButton {...SectionButtonCustomLeftIconProps} />
    </>
  ));

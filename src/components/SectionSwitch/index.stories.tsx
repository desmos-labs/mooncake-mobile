import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import SectionSwitch from './index';

type CompProps = React.ComponentProps<typeof SectionSwitch>;

const ActiveSwitchProps: CompProps = {
  label: 'Switch active',
  value: true,
  disabled: false,
};

const InactiveSwitchProps: CompProps = {
  label: 'Switch inactive',
  value: false,
  disabled: false,
};

const DisabledSwitchProps: CompProps = {
  label: 'Switch disabled',
  value: false,
  disabled: true,
};

storiesOf('components/Section', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Section switches', () => (
    <>
      <SectionSwitch {...ActiveSwitchProps} />
      <SectionSwitch {...InactiveSwitchProps} />
      <SectionSwitch {...DisabledSwitchProps} />
    </>
  ));

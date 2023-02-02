import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import CustomRadioGroup, { RadioValue } from './index';

const initialiRadioValues: RadioValue[] = [
  { label: 'spam', value: 'spam' },
  { label: 'scam', value: 'scam' },
  { label: 'nudity', value: 'nudity' },
  { label: 'violent', value: 'violent' },
  { label: 'others', value: 'others' },
];

const RenderComponent = () => {
  const [state, setState] = useState(0);

  return (
    <CustomRadioGroup
      values={initialiRadioValues}
      selectedValue={state}
      onSelect={index => {
        setState(index);
      }}
    />
  );
};

// DTextInput as in Desmos TextInput
storiesOf('components/CustomRadioGroup', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <RenderComponent />);

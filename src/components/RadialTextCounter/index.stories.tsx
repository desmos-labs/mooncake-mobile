import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {TextInput} from 'react-native';
import RadialTextCounter from './index';

const ComponentWithState = () => {
  const [text, setText] = React.useState('');
  const TEXT_LIMIT = 20;

  return (
    <>
      <RadialTextCounter max={TEXT_LIMIT} current={text.length} />

      {/* need to manually set maxLength on input */}
      {/* it would be a good idea to use a shared variable for this */}
      <TextInput
        maxLength={TEXT_LIMIT}
        value={text}
        onChangeText={setText}
        placeholder="Enter text here"
      />
    </>
  );
};

storiesOf('components/RadialTextCounter', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <ComponentWithState />);

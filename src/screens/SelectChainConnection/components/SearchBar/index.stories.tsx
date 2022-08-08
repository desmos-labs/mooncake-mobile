import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import SearchBar from './index';

const RenderComponent = () => {
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    console.log(value);
  }, [value]);

  return <SearchBar handleChange={setValue} />;
};

storiesOf('components/SearchBar', module)
  .addDecorator(s => (
    <SbContainer padding={16} justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <RenderComponent />);

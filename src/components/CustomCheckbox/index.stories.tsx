import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import CustomCheck from 'components/CustomCheckbox/index';

const RenderComponent = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <CustomCheck
      checked={checked}
      handlePress={() => setChecked(prev => !prev)}
    />
  );
};

storiesOf('component/CustomCheckbox', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <RenderComponent />);

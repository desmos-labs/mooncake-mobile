import Button from 'components/Button';
import CustomSnackbar from 'components/CustomSnackbar/index';
import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';

const RenderComponent = () => {
  const [state, setState] = React.useState(false);
  const [state1, setState1] = React.useState(false);

  return (
    <>
      <Button mode="text" onPress={() => setState(!state)}>
        failure top
      </Button>
      <Button mode="text" onPress={() => setState1(!state1)}>
        success top
      </Button>
      <CustomSnackbar
        showSnackbar={state}
        snackBarMode="failure"
        position="top"
        title="Oops!"
        message="Reaction failed to add"
        buttonLabel="Retry"
        buttonAction={() => console.log('pressed')}
        swipeUpAction={() => setState(!state)}
      />
      <CustomSnackbar
        showSnackbar={state1}
        snackBarMode="success"
        position="top"
        message="Success"
        buttonAction={() => console.log('pressed')}
        swipeUpAction={() => setState1(!state1)}
      />
    </>
  );
};

storiesOf('component/CustomSnackbar', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <RenderComponent />);

import Button from 'components/Button';
import CustomSnackbar from 'components/CustomSnackbar/index';
import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';

const RenderComponent = () => {
  const [messages, setMessages] = React.useState<{label: string}[]>([]);

  return (
    <>
      <Button
        mode="text"
        onPress={() =>
          setMessages([...messages, {label: `test${Math.random()}`}])
        }>
        add toast
      </Button>
      <Button
        mode="text"
        onPress={() => {
          setMessages(messages.slice(0, -1));
        }}>
        remove toast
      </Button>
      <CustomSnackbar transactions={messages} />
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

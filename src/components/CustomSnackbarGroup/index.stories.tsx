import {storiesOf} from '@storybook/react-native';
import Button from 'components/Button';
import CustomSnackbarGroup from 'components/CustomSnackbarGroup/index';
import React from 'react';
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
      <CustomSnackbarGroup
        transactions={messages}
        autoHide={true}
        autoHideMs={500}
        onHide={() => setMessages(messages.slice(0, -1))}
      />
    </>
  );
};

storiesOf('component/CustomSnackbarGroup', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <RenderComponent />);

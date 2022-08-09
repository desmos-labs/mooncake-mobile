import React from 'react';
import ReactionItem from 'screens/PostInteraction/PostReactions/components/ReactionItem/index';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';

const RenderComponent = () => {
  const [followed, setFollowed] = React.useState(false);

  return (
    <ReactionItem
      userAddress="123123123"
      nickname="Shrek"
      dTag="SwampyBoi"
      avatar={{uri: 'https://i.imgur.com/aih9snA.png'}}
      handlePressFollow={() => {
        setFollowed(true);
      }}
      handlePressUnfollow={() => {
        setFollowed(false);
      }}
      followed={followed}
    />
  );
};

storiesOf('components/ReactionItem', module)
  .addDecorator(s => <SbContainer justifyContent="center">{s()}</SbContainer>)
  .add('default', () => <RenderComponent />);

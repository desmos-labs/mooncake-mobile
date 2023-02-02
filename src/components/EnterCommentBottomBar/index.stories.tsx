import { storiesOf } from '@storybook/react-native';
import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import EnterCommentBottomBar from './index';

type CompProps = React.ComponentProps<typeof EnterCommentBottomBar>;

const DefaultProps: CompProps = {
  profileImage: {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Alberto_conversi_profile_pic.jpg',
  },
  onIconPress: () => console.log('test'),
  focusTextInput: false,
  loading: false,
  handlePostComment: () => console.log('post'),
};

// MaterialButton as in Desmos Button
storiesOf('components/EnterCommentBottomBar', module)
  .addDecorator(getStories => <SbContainer justifyContent="flex-end">{getStories()}</SbContainer>)
  .add('Text', () => <EnterCommentBottomBar {...DefaultProps} />);

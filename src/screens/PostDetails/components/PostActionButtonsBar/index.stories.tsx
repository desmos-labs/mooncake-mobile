import { storiesOf } from '@storybook/react-native';
import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import PostActionButtonsBar from './index';

const RenderDefault = () => {
  return (
    <PostActionButtonsBar
      postLiked={true}
      handleTipPress={() => console.log('test')}
      handleCommentPress={() => console.log('test')}
      handleLikePress={() => console.log('test')}
    />
  );
};

storiesOf('components/PostActionButtonsBar', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('Default', () => <RenderDefault />);

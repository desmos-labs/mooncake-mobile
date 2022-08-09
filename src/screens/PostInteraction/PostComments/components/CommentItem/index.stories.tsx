import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import {storiesOf} from '@storybook/react-native';
import {action} from '@storybook/addon-actions';
import CommentItem from './index';

type CompProps = React.ComponentProps<typeof CommentItem>;

const defaultProps: CompProps = {
  handlePress: action('handlePress'),
  handlePressComment: action('handlePressComment'),
  handlePressLike: action('handlePressLike'),
  handlePressMore: action('handlePressMore'),
  handlePressTip: action('handlePressTip'),
  avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
  nickname: 'Shrek',
  dTag: 'Swampyboi',
  numComments: 1,
  numReactions: 2,
  numTips: 0,
  timestamp: '2022-07-03T16:00:40.08408',
  text: 'Lorem ipsum dolor sit amet, rices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellent',
};

const imageCommentProps: CompProps = {
  ...defaultProps,
  attachments: [
    {
      id: 1,
      content: {
        uri: 'https://i.imgur.com/aih9snA.png',
        '@type': '/desmos.posts.v1.Media',
        mime_type: 'image/png',
      },
    },
  ],
};

const likedCommentProps: CompProps = {
  ...defaultProps,
  liked: true,
};

storiesOf('components/CommentItem', module)
  .addDecorator(s => <SbContainer justifyContent="center">{s()}</SbContainer>)
  .add('text comment', () => <CommentItem {...defaultProps} />)
  .add('image comment', () => <CommentItem {...imageCommentProps} />)
  .add('liked comment', () => <CommentItem {...likedCommentProps} />);

import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { Dimensions, View } from 'react-native';
import { Post, PostStatus } from 'types/posts';
import PostCard from './index';

type CompType = React.ComponentProps<typeof PostCard>;

const textPostData: Post = {
  status: PostStatus.SYNCED,
  externalId: '',
  creationDate: '2022-06-30T17:06:47.475817',
  attachments: [],
  author: {
    address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
    bio: '',
    dtag: 'Donatello',
    profilePicture: 'https://i.imgur.com/aih9snA.png',
    nickname: 'Nickname',
  },
  subspaceId: 5,
  text: "I'm a ninja turtle that is a teenager.",
  conversationId: 0,
  id: 3,
  transactions: [],
};

const imagePostData: Post = {
  ...textPostData,
  text: '',
  attachments: [
    {
      id: 1,
      content: {
        uri: 'https://i.imgur.com/aih9snA.png',
        mimeType: 'image/png',
      },
      size: {
        height: 100,
        width: 100,
      },
    },
  ],
};

const imageAndTextPostData: Post = {
  ...textPostData,
  text: 'Shrek is my favorite anime.Shrek is my favorite anime.Shrek is my favorite anime.',
  attachments: [
    {
      id: 1,
      content: {
        uri: 'https://i.imgur.com/aih9snA.png',
        mimeType: 'image/png',
      },
      size: {
        height: 100,
        width: 100,
      },
    },
  ],
};

const textPost: CompType = {
  post: textPostData,
  onPressAuthor: action('onPressAuthor'),
  onPressFollow: action('onPressFollow'),
  onPressDetails: action('onPressDetails'),
  onPressReport: action('onPressReport'),
  onPressLike: action('onPressLike'),
  onPressComment: action('onPressComment'),
  onPressTip: action('onPressTip'),
};

const imagePost: CompType = {
  ...textPost,
  post: imagePostData,
};

const textAndImagePost: CompType = {
  ...textPost,
  post: imageAndTextPostData,
};

// These dimensions are not the same as the ones found on the
// home screen, but they are good enough to preview the component
storiesOf('component/PostCard', module)
  .addDecorator(s => (
    <SbContainer alignItems="center" justifyContent="center">
      <View
        style={{
          width: Dimensions.get('window').width * 0.8,
          height: Dimensions.get('window').height * 0.7,
        }}>
        {s()}
      </View>
    </SbContainer>
  ))
  .add('Text Post', () => <PostCard {...textPost} />)
  .add('Image Post', () => <PostCard {...imagePost} />)
  .add('Image and text post', () => <PostCard {...textAndImagePost} />);

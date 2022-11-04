import React from 'react';

import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {Dimensions, View} from 'react-native';
import PostCard from './index';

type CompType = React.ComponentProps<typeof PostCard>;

const textPostData: PostItem = {
  creation_date: '2022-06-30T17:06:47.475817',
  author_address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
  attachments: [],
  author: {
    address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
    bio: '',
    dtag: 'Donatello',
    profile_pic: 'https://i.imgur.com/aih9snA.png',
    nickname: 'Nickname',
  },
  subspace_id: 5,
  reactions: [],
  text: "I'm a ninja turtle that is a teenager.",
  conversation: null,
  id: 3,
  reactionPresence: {
    aggregate: {
      count: 1,
    },
  },
  commentPresence: {
    aggregate: {
      count: 1,
    },
  },
  tipPresence: {
    aggregate: {
      count: 1,
    },
  },
  repliesCount: {
    aggregate: {
      count: 4,
    },
  },
  tips: [],
};

const imagePostData: PostItem = {
  ...textPostData,
  text: '',
  attachments: [
    {
      id: 1,
      content: {
        uri: 'https://i.imgur.com/aih9snA.png',
        mimeType: 'image/png',
      },
    },
  ],
};

const imageAndTextPostData: PostItem = {
  ...textPostData,
  text: 'Shrek is my favorite anime.Shrek is my favorite anime.Shrek is my favorite anime.',
  attachments: [
    {
      id: 1,
      content: {
        uri: 'https://i.imgur.com/aih9snA.png',
        mimeType: 'image/png',
      },
    },
  ],
};

const textPost: CompType = {
  postData: textPostData,

  onPressAuthor: action('onPressAuthor'),

  onPressFollow: action('onPressFollow'),

  onPressDetails: action('onPressDetails'),
};

const imagePost: CompType = {
  ...textPost,

  postData: imagePostData,
};

const textAndImagePost: CompType = {
  ...textPost,
  postData: imageAndTextPostData,
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

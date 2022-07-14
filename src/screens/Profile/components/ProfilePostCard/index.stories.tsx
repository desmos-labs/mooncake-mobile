import React from 'react';

import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
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
};

const imagePostData: PostItem = {
  ...textPostData,
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

const textPost: CompType = {
  postData: textPostData,

  onPress: action('onPress'),
};

const imagePost: CompType = {
  ...textPost,

  postData: imagePostData,
};

storiesOf('component/ProfilePostCard', module)
  .addDecorator(s => (
    <SbContainer alignItems="center" justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('Text Post', () => <PostCard {...textPost} />)
  .add('Image Post', () => <PostCard {...imagePost} />);

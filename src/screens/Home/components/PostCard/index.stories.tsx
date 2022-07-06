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

  onPressAuthor: action('onPressAuthor'),

  onPressFollow: action('onPressFollow'),

  onPressDetails: action('onPressDetails'),
};

const imagePost: CompType = {
  ...textPost,

  postData: imagePostData,
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
  .add('Image Post', () => <PostCard {...imagePost} />);

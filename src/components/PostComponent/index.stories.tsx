import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {Dimensions, View} from 'react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import PostComponent from './index';

type CompType = React.ComponentProps<typeof PostComponent>;

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
  text: '',
  attachments: [
    {
      id: 1,
      content: {
        uri: 'https://images.wallpapersden.com/image/download/minimal-abstract-2021-art_bGxla2aUmZqaraWkpJRmbmdlrWZlbWU.jpg',
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
        uri: 'https://images.wallpapersden.com/image/download/minimal-abstract-2021-art_bGxla2aUmZqaraWkpJRmbmdlrWZlbWU.jpg',
        '@type': '/desmos.posts.v1.Media',
        mime_type: 'image/png',
      },
    },
  ],
};

const textPost: CompType = {
  postData: textPostData,
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
storiesOf('component/PostComponent', module)
  .addDecorator(s => (
    <SbContainer alignItems="center">
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.7,
        }}>
        {s()}
      </View>
    </SbContainer>
  ))
  .add('Text Post', () => <PostComponent {...textPost} />)
  .add('Image Post', () => <PostComponent {...imagePost} />)
  .add('Image and text post', () => <PostComponent {...textAndImagePost} />);

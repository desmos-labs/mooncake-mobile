import React from 'react';
import { render } from 'jest/utils/CustomRender';
import PostComponent from 'components/PostComponent/index';

const mockTextPostData = {
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
  tips: [],
  transactions: [],
  commentPresence: {
    aggregate: {
      count: 0,
    },
  },
  reactionPresence: {
    aggregate: {
      count: 0,
    },
  },
  tipPresence: {
    aggregate: {
      count: 0,
    },
  },
  repliesCount: {
    aggregate: {
      count: 0,
    },
  },
};

const mockImagePostData = {
  ...mockTextPostData,
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

const mockTextImagePostData = {
  ...mockTextPostData,
  text: 'Hello world',
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

describe('component: PostComponent', () => {
  it('renders', () => {
    const tree = render(<PostComponent postData={mockTextPostData} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders image posts', () => {
    const tree = render(<PostComponent postData={mockImagePostData} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders textImage posts', () => {
    const tree = render(<PostComponent postData={mockTextImagePostData} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

const useHooks = () => {
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
    text: "I'm a ninja turtle that is a teenager. I'm a ninja turtle that is a teenager. ",
    conversation: null,
    id: 3,
  };

  const imagePostData: PostItem = {
    ...textPostData,
    attachments: [
      {
        id: 1,
        content: {
          uri: 'https://img.freepik.com/free-vector/colorful-palm-silhouettes-background_23-2148541792.jpg?w=1480&t=st=1660739347~exp=1660739947~hmac=a5b2dafae9c087fb414785c0bbf1f253147fe07756b2289aedae4478fb8ef231',
          '@type': '/desmos.posts.v1.Media',
          mime_type: 'image/png',
        },
      },
    ],
  };

  const defaultProps = {
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    nickname: 'Shrek',
    dTag: 'Swampyboi',
    numComments: 1,
    numReactions: 2,
    numTips: 0,
    timestamp: '2022-07-03T16:00:40.08408',
    text: 'Lorem ipsum dolor sit amet, rices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellent',
  };

  const imageCommentProps = {
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

  const likedCommentProps = {
    ...defaultProps,
    liked: true,
  };

  const DUMMY_AUTHOR: PostAuthor = {
    nickname: 'Shrek',
    dtag: 'SwampyBoi',
    address: '123test123',
    bio: 'get out of my swamp',
    profile_pic: '',
  };

  const DUMMY_COMMENTS = [
    defaultProps,
    likedCommentProps,
    imageCommentProps,
    defaultProps,
  ];

  return {
    DUMMY_AUTHOR,
    DUMMY_COMMENTS,
    textPostData,
    imagePostData,
  };
};

export default useHooks;

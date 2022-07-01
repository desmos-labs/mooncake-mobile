import {atom, useRecoilState} from 'recoil';
import {Post} from '@desmoslabs/desmjs-types/desmos/posts/v1beta1/posts';

export const postsState = atom<Post[]>({
  key: 'posts',
  default: [
    {
      subspaceId: '5',
      sectionId: 1,
      id: '1',
      text: 'WHAT ARE YOU DOING IN MY SWAMP',
      entities: {
        urls: [
          {
            end: '3',
            url: 'https://example.com',
            displayUrl: 'this.uri',
          },
        ],
      },
      author: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      replySettings: 'REPLY_SETTING_EVERYONE',
      creationDate: '2022-06-30T17:04:54.578160261Z',
    },
    {
      subspaceId: '5',
      sectionId: 1,
      id: '2',
      text: 'Ogres are like onions.',
      entities: {
        urls: [
          {
            end: '3',
            url: 'https://example.com',
            displayUrl: 'this.uri',
          },
        ],
      },
      author: 'desmos1n39pwnwnsurvh8zcxwaahttmkvqtxqdmyaln7n',
      replySettings: 'REPLY_SETTING_EVERYONE',
      creationDate: '2022-06-30T17:06:30.426295549Z',
    },
    {
      subspaceId: '5',
      sectionId: 1,
      id: '3',
      text: 'I like that boulder.',
      entities: {
        urls: [
          {
            end: '3',
            url: 'https://example.com',
            displayUrl: 'this.uri',
          },
        ],
      },
      author: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
      replySettings: 'REPLY_SETTING_EVERYONE',
      creationDate: '2022-06-30T17:06:47.475816605Z',
    },
  ],
});

// Get posts up to a given timestamp
// wip: complete this once BDJuno is updated with post queries
// note that posts only have the author's address, will need to make another
// query to retrieve the user's profile
export const useGetPosts = (timestamp: string) => {
  console.log(timestamp);
  const [posts, setPosts] = useRecoilState(postsState);

  // pretend a gql query gets called here
  const newPosts: Post[] = [];

  setPosts(prev => [...prev, ...newPosts]);

  return posts;
};

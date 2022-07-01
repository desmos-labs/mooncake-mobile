import {atom, useRecoilState} from 'recoil';

export const postsState = atom<PostItem[]>({
  key: 'posts',
  default: [
    {
      author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      author: {
        address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
        bio: '',
        dtag: 'Raffaello',
        profile_pic: '',
        nickname: '',
      },
      subspace_id: 5,
      reactions: [],
      attachments: [
        {
          content: {
            uri: 'https://images.app.goo.gl/g7VHpLGJYjndRfWL6',
            '@type': '/desmos.posts.v1.Media',
            mime_type: 'image/png',
          },
        },
      ],
      text: 'This is a test post',
    },
    {
      author_address: 'desmos1n39pwnwnsurvh8zcxwaahttmkvqtxqdmyaln7n',
      author: {
        address: 'desmos1n39pwnwnsurvh8zcxwaahttmkvqtxqdmyaln7n',
        bio: '',
        dtag: 'Michelangelo',
        profile_pic: '',
        nickname: '',
      },
      subspace_id: 5,
      reactions: [],
      attachments: [
        {
          content: {
            '@type': '/desmos.posts.v1.Poll',
            end_date: '2025-01-01T12:00:00Z',
            question: 'A question',
            provided_answers: [
              {
                text: 'yes',
                attachments: [],
              },
              {
                text: 'no',
                attachments: [],
              },
            ],
            allows_answer_edits: true,
            final_tally_results: null,
            allows_multiple_answers: true,
          },
        },
      ],
      text: 'This is a test post',
    },
    {
      author_address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
      author: {
        address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
        bio: '',
        dtag: 'Donatello',
        profile_pic: '',
        nickname: '',
      },
      subspace_id: 5,
      reactions: [],
      attachments: [],
      text: 'This is a test post',
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
  const newPosts: PostItem[] = [];

  setPosts(prev => [...prev, ...newPosts]);

  return posts;
};

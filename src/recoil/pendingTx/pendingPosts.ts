import {atom, useRecoilState} from 'recoil';
import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';

export const pendingPostsState = atom<PendingPost[]>({
  key: 'pendingPosts',
  default: [
    {
      postData: {
        id: Math.random() * 10000,
        subspace_id: 5,
        isPending: true,

        text: 'hello world',

        attachments: [
          {
            id: 0,
            content: {
              uri: 'https://static.wikia.nocookie.net/chainsaw-man/images/0/0f/Volume_01.png',
              mimeType: 'image/jpeg',
            },
          },
        ],

        author_address: '123123',
      },
      txHash: 'hashyboi',
      timestamp: new Date().getTime(),
      msgType: GrantEnums.MsgCreatePost,
    },
  ],
});

const usePendingPosts = () => {
  const [pendingPosts, setPendingPosts] = useRecoilState(pendingPostsState);

  /**
   * Add a new pending relationship to recoil state.
   * @param {PendingPost} newPost - The new relationship to be added.
   */
  const addNewPendingPost = React.useCallback(
    (newPost: PendingPost) => {
      console.log(JSON.stringify(newPost));

      setPendingPosts(prev => [...prev, newPost]);
    },
    [pendingPosts],
  );

  /**
   * Remove a pending relationship by its txHash.
   * @param {string} txHash - The txHash to remove.
   */
  const resolveByTxHash = React.useCallback(
    (txHash: string) => {
      setPendingPosts(prev => prev.filter(x => x.txHash !== txHash));
    },
    [pendingPosts],
  );

  return {
    resolveByTxHash,
    addNewPendingPost,
  };
};

export default usePendingPosts;

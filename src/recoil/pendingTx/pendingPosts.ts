import {atom, useRecoilState} from 'recoil';
import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';

export const pendingPostsState = atom<PendingPost[]>({
  key: 'pendingPosts',
  default: [
    {
      postData: {
        id: 3152.7356465919643,
        subspace_id: 5,
        isPending: true,
        text: 'Pending Test 5',
        attachments: [
          {
            id: 0,
            content: {
              uri: 'https://testnet-api.dfp.desmos.network/files/bafybeiecsjxva2rli7vxjzn4if2pww5qhwpcf72kcyyttwvkrqzn6ombki-IMG_0014.JPG',
              mimeType: 'image/jpeg',
            },
          },
        ],
        author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      },
      txHash:
        'C402BB1D033B426F59D9462CFF46D12E8D2C3BBA495D17A384657FA666D2F361',
      timestamp: 1666178419321,
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

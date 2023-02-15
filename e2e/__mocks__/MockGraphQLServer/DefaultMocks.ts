/**
 * Default mocks for custom scalar types. These are arbitrary values meant to
 * suppress graphql errors during e2e testing, and can be overwritten by passing
 * the relevant key value in the mocks value during server creation.
 */
const DEFAULT_GRAPHQL_MOCKS = {
  bigint: () => 1,
  timestamp: () => '2023-02-13T10:26:48Z',
  jsonb: () => {},
  post_params: () => [
    {params: {max_text_length: 500}, __typename: 'posts_params'},
  ],
  profiles_params: () => [
    {
      params: {
        bio: {max_length: '1000'},
        dtag: {reg_ex: '^[A-Za-z0-9_]+$', max_length: '30', min_length: '3'},
        oracle: {
          ask_count: 5,
          min_count: 3,
          script_id: 32,
          fee_amount: [],
          execute_gas: 200000,
          prepare_gas: 50000,
        },
        nickname: {max_length: '1000', min_length: '2'},
        app_links: {validity_duration: 31536000000000000},
      },
      __typename: 'profiles_params',
    },
  ],
  post: () => [
    {
      id: 1,
      creation_date: '2023-02-13T15:33:26.224424',
      author_address: 'desmos10nm0u9wwrv5hsnjtq327f0yyyjyd8akg86pdq5',
      attachments: [
        {
          id: 1,
          content: {
            uri: 'https://apis.testnet.butter.social/files/bafybeiao64xz3oujc3k2j5ohinjsz2cotswmtuydo74t34jqpj7cy44zvm-rn_image_picker_lib_temp_7b58a58e-1065-4692-9e2d-94d55c952c9f.jpg',
            '@type': '/desmos.posts.v2.Media',
            mime_type: 'image/jpeg',
          },
          size: [
            {
              width: 1080,
              height: 1440,
              __typename: 'post_attachment_size',
            },
          ],
          __typename: 'post_attachment',
        },
      ],
      external_id: 'e4f051dc-52fe-46cb-8570-cdbde7860ced',
      author: {
        address: 'desmos10nm0u9wwrv5hsnjtq327f0yyyjyd8akg86pdq5',
        bio: '',
        dtag: 'galaxybrain',
        profile_pic:
          'https://apis.testnet.butter.social/files/bafybeibr7awhnn2joyqefylrwxxyizt3tm6lc5rwuutzir6odv76jdezgi-rn_image_picker_lib_temp_148438d2-102d-48c4-ab51-914a3d2ed339.jpg',
        nickname: 'ohno',
        __typename: 'profile',
      },
      subspace_id: 5,
      reactions: [
        {
          id: 0,
          value: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
          },
          author: {
            address: 'desmos1948ldgztmzag8ygsvsmr2uyncjrkg3s2tynn05',
            __typename: 'profile',
          },
          __typename: 'reaction',
        },
        {
          id: 1,
          value: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
          },
          author: {
            address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
            __typename: 'profile',
          },
          __typename: 'reaction',
        },
      ],
      tips: [],
      text: null,
      conversation: null,
      transactions: [
        {
          hash: '6A3A52FAB0EF4C1A3AACF34296A5C24729BB280C6031C80CBE456BE773733A17',
          __typename: 'post_transaction',
        },
      ],
      replies: [],
      repliesCount: {
        aggregate: {
          count: 1,
          __typename: 'post_reference_aggregate_fields',
        },
        __typename: 'post_reference_aggregate',
      },
      __typename: 'post',
      reactionPresence: {
        aggregate: {
          count: 0,
          __typename: 'reaction_aggregate_fields',
        },
        __typename: 'reaction_aggregate',
      },
      tipPresence: {
        aggregate: {
          count: 0,
          __typename: 'tip_post_aggregate_fields',
        },
        __typename: 'tip_post_aggregate',
      },
      commentPresence: {
        aggregate: {
          count: 0,
          __typename: 'post_aggregate_fields',
        },
        __typename: 'post_aggregate',
      },
    },
    {
      id: 2,
      creation_date: '2023-02-13T15:33:26.224424',
      author_address: 'desmos10nm0u9wwrv5hsnjtq327f0yyyjyd8akg86pdq5',
      attachments: [],
      external_id: 'e4f051dc-52fe-46cb-8570-cdbde7860ced',
      author: {
        address: 'desmos10nm0u9wwrv5hsnjtq327f0yyyjyd8akg86pdq5',
        bio: '',
        dtag: 'galaxybrain',
        profile_pic:
          'https://apis.testnet.butter.social/files/bafybeibr7awhnn2joyqefylrwxxyizt3tm6lc5rwuutzir6odv76jdezgi-rn_image_picker_lib_temp_148438d2-102d-48c4-ab51-914a3d2ed339.jpg',
        nickname: 'ohno',
        __typename: 'profile',
      },
      subspace_id: 5,
      reactions: [
        {
          id: 0,
          value: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
          },
          author: {
            address: 'desmos1948ldgztmzag8ygsvsmr2uyncjrkg3s2tynn05',
            __typename: 'profile',
          },
          __typename: 'reaction',
        },
        {
          id: 1,
          value: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
          },
          author: {
            address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
            __typename: 'profile',
          },
          __typename: 'reaction',
        },
      ],
      tips: [],
      text: 'hello world',
      conversation: null,
      transactions: [
        {
          hash: '6A3A52FAB0EF4C1A3AACF34296A5C24729BB280C6031C80CBE456BE773733A17',
          __typename: 'post_transaction',
        },
      ],
      replies: [],
      repliesCount: {
        aggregate: {
          count: 1,
          __typename: 'post_reference_aggregate_fields',
        },
        __typename: 'post_reference_aggregate',
      },
      __typename: 'post',
      reactionPresence: {
        aggregate: {
          count: 0,
          __typename: 'reaction_aggregate_fields',
        },
        __typename: 'reaction_aggregate',
      },
      tipPresence: {
        aggregate: {
          count: 0,
          __typename: 'tip_post_aggregate_fields',
        },
        __typename: 'tip_post_aggregate',
      },
      commentPresence: {
        aggregate: {
          count: 0,
          __typename: 'post_aggregate_fields',
        },
        __typename: 'post_aggregate',
      },
    },
  ],
};

export default DEFAULT_GRAPHQL_MOCKS;

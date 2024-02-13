import { convertGraphQLPostAttachment } from 'lib/GraphQLUtils/posts';

describe('convertGraphQLPostAttachment', () => {
  it('undefined content_hash is converted properly', () => {
    const result = convertGraphQLPostAttachment({
      id: '1',
      content: {
        '@type': '/desmos.posts.v2.Media',
        uri: 'https://example.com',
        mime_type: 'image/jpeg',
      },
      size: [{ height: 100, width: 100 }],
      content_hash: undefined,
    });
    expect(result).toEqual({
      id: '1',
      content: {
        type: 0,
        uri: 'https://example.com',
        mimeType: 'image/jpeg',
      },
      size: { height: 100, width: 100 },
      contentHash: undefined,
    });
  });
});

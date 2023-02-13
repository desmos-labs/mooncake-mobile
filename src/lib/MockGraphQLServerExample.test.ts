import {MockGraphQLServer} from '../../e2e/__mocks__/MockGraphQLServer';
import {DETOX_MOCK_ACCOUNT} from '../../e2e/__mocks__/E2EVariableMocks';

// This is a temporary test file to demonstrate how to construct mock graphql data

// The following steps go over how to use this demo:
// 1) Run this test. The server will begin listening on http://localhost:4000
// 2) Connect to the graphiql interface at http://localhost:4000
// 3) Test the mock queries that can be configured below

const mocks = {
  query_root: () => ({
    profile: () => [DETOX_MOCK_ACCOUNT],
  }),
};

const server = MockGraphQLServer.createServerWithMocks(mocks);

describe('MockGraphQLServer test', () => {
  beforeAll(() => {
    server.startServer();
  });

  // uncomment this to manually test
  // afterAll(() => {
  //   server.stopServer();
  // });

  // fake test to keep server up
  it('tests', () => {
    expect(1).toEqual(1);
  });
});

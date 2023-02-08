import {MockList} from '@graphql-tools/mock';
import {faker} from '@faker-js/faker';
import {MockGraphQLServer} from '../../e2e/__mocks__/MockGraphQLServer';

// This is a temporary test file to demonstrate how to construct mock graphql data

// The following steps go over how to use this demo:
// 1) Run this test. The server will begin listening on http://localhost:4000
// 2) Connect to the graphiql interface at http://localhost:4000
// 3) Test the mock queries that can be configured below

const mocks = {
  // These are the query mocks. These control how much data is returned the query
  // The query names usually correspond to the paths found on the graphiql interface,
  // but the query_root object found on the schema is the actual value.
  // https://forbole.atlassian.net/wiki/spaces/DOG/pages/20086804/GraphQL+Schema
  query_root: () => ({
    // this particular mock will generate 10 application_links and 3 posts
    application_link: () => new MockList(10),
    post: () => [
      ...new MockList(3).mock(),
      // individual data can be inserted like so
      {
        id: 123,
        text: 'I am a unique text',
      },
    ],
  }),
  // bulk mock data is configured here
  application_link: () => ({
    id: 1,
  }),
  post: () => ({
    id: faker.datatype.number({min: 0, max: 100000}),
    text: faker.lorem.lines(faker.datatype.number({min: 1, max: 5})),
  }),
};

const server = MockGraphQLServer.createServerWithMocks(mocks);

describe('MockGraphQLServer test', () => {
  beforeAll(() => {
    server.startServer();
  });

  // uncomment this to manually test
  afterAll(() => {
    server.stopServer();
  });

  // fake test to keep server up
  it('tests', () => {
    expect(1).toEqual(1);
  });
});

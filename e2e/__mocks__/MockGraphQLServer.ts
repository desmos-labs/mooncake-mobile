import {addMocksToSchema, IMocks} from '@graphql-tools/mock';
import {buildClientSchema} from 'graphql/utilities';
import {createYoga} from 'graphql-yoga';
import {createServer} from 'node:http';

// suppress false positive
// eslint-disable-next-line import/no-unresolved
import {YogaSchemaDefinition} from 'graphql-yoga/typings/plugins/useSchema';

/**
 * Default mocks for custom scalar types. These are arbitrary values meant to
 * suppress graphql errors during e2e testing, and can be overwritten by passing
 * the relevant key value in the mocks value during server creation.
 */
const DEFAULT_CUSTOM_SCALAR_MOCKS = {
  bigint: () => 1,
  timestamp: () => '2023-02-13T10:26:48Z',
  jsonb: () => {},
};

/**
 *  The port that the mock graphql server will live on
 *  By default, this will resolve to http://localhost:4000/v1/graphql
 */
const MOCK_GRAPHQL_DEFAULT_PORT = 4000;

/**
 * A mock graphql server for e2e tests. By default, the server runs on
 * http://localhost:4000/v1/graphql
 */
// We only want to export the class below for this file.
// eslint-disable-next-line import/prefer-default-export
export class MockGraphQLServer {
  private readonly server: any;

  constructor(schema: YogaSchemaDefinition<any>) {
    const yoga = createYoga({
      schema,
      graphqlEndpoint: '/v1/graphql',
    });

    this.server = createServer(yoga);
  }

  /**
   * Create a server object with specified mocks.
   */
  static createServerWithMocks(mocks: IMocks<any>) {
    // @ts-ignore
    const graphqlSchemaObj = buildClientSchema(_schema);

    const schemaWithMocks = addMocksToSchema({
      schema: graphqlSchemaObj,
      mocks: {
        ...DEFAULT_CUSTOM_SCALAR_MOCKS,
        ...mocks,
      },
    });

    return new MockGraphQLServer(schemaWithMocks);
  }

  /**
   * Start the mock server and begin listening on the specified port
   */
  public async startServer() {
    if (!this.server) {
      throw new Error('Server object does not exist.');
    }
    this.server.listen(MOCK_GRAPHQL_DEFAULT_PORT, () => {
      console.log('yoga graphql listening on port 4000');
    });
  }

  /**
   * Stop the server from receiving new connections.
   */
  public stopServer() {
    if (!this.server) {
      throw new Error('Server object does not exist.');
    }

    this.server.close();
  }
}

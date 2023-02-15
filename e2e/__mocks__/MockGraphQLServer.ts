import {addMocksToSchema} from '@graphql-tools/mock';

import {buildClientSchema} from 'graphql/utilities';
import {createYoga} from 'graphql-yoga';
import {createServer} from 'node:http';
// suppress false positive
// eslint-disable-next-line import/no-unresolved
import {YogaSchemaDefinition} from 'graphql-yoga/typings/plugins/useSchema';
import _schema from './schema.json';

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
   * TODO: figure out proper types for this
   */
  static createServerWithMocks(mocks: any) {
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

  public async startServer() {
    if (!this.server) {
      throw new Error('Server object does not exist.');
    }
    this.server.listen(4000, () => {
      console.log('yoga graphql listening on port 4000');
    });
  }

  public stopServer() {
    if (!this.server) {
      throw new Error('Server object does not exist.');
    }

    this.server.close();
  }
}

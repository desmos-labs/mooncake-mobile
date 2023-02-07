import {addMocksToSchema} from '@graphql-tools/mock';

import {buildClientSchema} from 'graphql/utilities';
import {createYoga} from 'graphql-yoga';
import {createServer} from 'node:http';
// eslint-disable-next-line import/no-unresolved
import {YogaSchemaDefinition} from 'graphql-yoga/typings/plugins/useSchema';
import _schema from './schema.json';

// eslint-disable-next-line import/prefer-default-export
export class MockGraphQLServer {
  private readonly server: any;

  constructor(schema: YogaSchemaDefinition<any>) {
    const yoga = createYoga({
      schema,
    });

    this.server = createServer(yoga);
  }

  static createServerWithMocks(mocks: any) {
    // @ts-ignore
    const graphqlSchemaObj = buildClientSchema(_schema);

    const schemaWithMocks = addMocksToSchema({
      schema: graphqlSchemaObj,
      mocks,
    });

    return new MockGraphQLServer(schemaWithMocks);
  }

  public async startServer() {
    if (!this.server) {
      throw new Error('Starting a server that has not been configured yet.');
    }
    this.server.listen(4000, () => {
      console.log('yoga graphql listening on port 4000');
    });
  }

  public stopServer() {
    if (!this.server) {
      throw new Error('Server does not exist');
    }

    this.server.close();
  }
}

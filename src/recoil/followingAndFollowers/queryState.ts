import {DocumentNode} from '@apollo/client';
import {selectorFamily} from 'recoil';
import GetFollowers, {QueueData} from 'services/graphql/queries/GetFollowers';
import GetFollowing from 'services/graphql/queries/GetFollowing';
import {apolloClient} from 'services/graphql/useApolloClient';
import {PAGINATION_LIMIT, QueryParam, PaginatedData} from '.';

// // debug mocking
// let id = 1;

const queryMap: {[stateType: string]: DocumentNode} = {
  following: GetFollowing,
  followers: GetFollowers,
};

/* It's creating a selector that fetches the following accounts for a given page. */
const queryState = selectorFamily<PaginatedData<FollowersData>, QueryParam>({
  key: 'queryState',
  get:
    ({stateType, subspaceID, userAddress, page}) =>
    async () => {
      /* It's making a GraphQL query to the server. */
      const query = queryMap[stateType];
      const response = await apolloClient.query<QueueData>({
        query,
        variables: {
          subspaceID,
          userAddress,
          limit: PAGINATION_LIMIT,
          offset: PAGINATION_LIMIT * (page - 1),
        },
      });

      /* It's throwing an error if the GraphQL query fails. */
      if (response.error) {
        throw response.error;
      }

      // const response = await new Promise<{data: QueueData}>(
      //   (resolve, reject) => {
      //     if (Math.random() > 0.9) {
      //       reject(new Error('random error'));
      //       return;
      //     }
      //     const user_relationship: QueueData['user_relationship'] = [];
      //     for (let i = 0; i < 20; i++) {
      //       if (id >= 10000000) break;
      //       user_relationship.push({
      //         _: {
      //           dtag: `GoFind.${++id}`,
      //           address: 'desmos1p7ce9sydhm7dsugl890g9unmp99nmq0gz9f4vx',
      //           nickname: `GoFind.${id}`,
      //           profile_pic: `https://picsum.photos/40?.${id}`,
      //         },
      //       });
      //       user_relationship.push({
      //         _: {
      //           dtag: `Masternode24.${++id}`,
      //           address: 'desmos1h5f3dywec65v9qulxkmcv3e6yujyh3zm39lr4r',
      //           nickname: `Masternode24.de.${id}`,
      //           profile_pic: `https://picsum.photos/40?.${id}`,
      //         },
      //       });
      //       user_relationship.push({
      //         _: {
      //           dtag: `dima_student2.${++id}`,
      //           address: 'desmos1ys42amj53hka8mx4h2nvz4hxf82v9rwvn6xuxh',
      //           nickname: `dima_student2#2856.${id}`,
      //           profile_pic: `https://picsum.photos/40?.${id}`,
      //         },
      //       });
      //       user_relationship.push({
      //         _: {
      //           dtag: `!Masternode24.${++id}`,
      //           address: 'desmos1h5f3dywec65v9qulxkmcv3e6yujyh3zm39lr4r',
      //           nickname: `!Masternode24.de.${id}`,
      //           profile_pic: `https://picsum.photos/40?.${id}`,
      //         },
      //       });
      //       user_relationship.push({
      //         _: {
      //           dtag: `!dima_student2.${++id}`,
      //           address: 'desmos1ys42amj53hka8mx4h2nvz4hxf82v9rwvn6xuxh',
      //           nickname: `!dima_student2#2856.${id}`,
      //           profile_pic: '',
      //         },
      //       });
      //     }
      //     setTimeout(
      //       () =>
      //         resolve({
      //           data: {
      //             user_relationship,
      //             user_relationship_aggregate: {
      //               aggregate: {
      //                 count: 10000000,
      //               },
      //             },
      //           },
      //         }),
      //       Math.random() > 0.9 ? 10000 : 0,
      //     );
      //   },
      // );

      /* It's destructuring the response data and mapping the _ field. */
      const {user_relationship, user_relationship_aggregate} = response.data;
      return {
        key: userAddress,
        data: user_relationship.map(r => r._),
        count: user_relationship_aggregate.aggregate.count,
      };
    },
  cachePolicy_UNSTABLE: {eviction: 'lru', maxSize: 100},
});

export default queryState;

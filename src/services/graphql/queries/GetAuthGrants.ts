import EnvConfig from 'config/EnvConfig';
import React from 'react';
import {gql} from '@apollo/client';
import useActiveAccount from 'hooks/useActiveAccount';
import {useButterConfig} from '@recoil/butterConfigState';
import client from 'services/graphql/client';
import _ from 'lodash';
import {GrantEnums} from 'lib/desmos/msgtypes';

const GetAuthzGrants = gql`
  query UserAuthzGrants($userAddress: String!, $granterAddress: String!)
  @api(name: desmos) {
    authz_grant(
      where: {
        grantee_address: {_eq: $userAddress}
        granter_address: {_eq: $granterAddress}
      }
    ) {
      msg_type_url
      authorization
      expiration
    }
  }
`;

const GetFeeGrantCount = gql`
  query UserFeeGrants($userAddress: String!, $granterAddress: String!)
  @api(name: desmos) {
    fee_grant_aggregate(
      where: {
        granter_address: {_eq: $granterAddress}
        grantee_address: {_eq: $userAddress}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// eslint-disable-next-line import/prefer-default-export
export const useGetAuthzGrants = () => {
  const {activeAddress} = useActiveAccount();

  const {
    butterConfig: {desmos_address: grantsAddress},
  } = useButterConfig();

  const getAuthzGrants = React.useCallback(async (): Promise<{
    has_fee_grant: boolean;
    grants: {
      msg_type: GrantEnums;

      expiration: string;
    }[];
  }> => {
    if (!grantsAddress) {
      throw new Error('[DEBUG] grantsAddress not found');
    }

    const [feeGrantData, grantsData] = await Promise.all([
      client.query({
        query: GetFeeGrantCount,
        variables: {
          userAddress: grantsAddress,
          granterAddress: activeAddress,
        },
        fetchPolicy: 'no-cache',
      }),
      client.watchQuery({
        query: GetAuthzGrants,
        variables: {
          userAddress: grantsAddress,
          granterAddress: activeAddress,
        },
        fetchPolicy: 'no-cache',
        pollInterval: EnvConfig.POLLING_INTERVAL,
      }),
    ]);
    await grantsData.result();
    const _grants: any[] =
      _.get(grantsData.getCurrentResult(), 'data.authz_grant') || [];
    const formattedGrants = _grants.map(grant => ({
      msg_type: grant.authorization.msg,
      expiration: grant.expiration,
    }));

    const numFeeGrants = _.get(
      feeGrantData,
      'data.fee_grant_aggregate.aggregate.count',
    );

    const has_fee_grant = numFeeGrants > 0;

    return {
      has_fee_grant,
      grants: formattedGrants,
    };
  }, [activeAddress, grantsAddress]);

  return {
    getAuthzGrants,
  };
};

import {OfflineSigner} from '@cosmjs/proto-signing';
import {MsgRevokeAllowanceEncodeObject} from '@desmoslabs/desmjs';
import {useNavigation} from '@react-navigation/native';
import {authorizationImage} from 'assets/images';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
  buildRevokeAllowanceEncode,
  buildRevokeGrantMsgEncodes,
} from 'hooks/authGrants/useAddOrUpdateGrants/utils';
import {GrantEnums} from 'lib/desmos/msgtypes';
import _ from 'lodash';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useGetAuthzGrants} from 'services/graphql/queries/GetAuthGrants';
import {useActiveAccount} from '@recoil/accounts';
import useButterConfig from 'hooks/useButterConfig';

/**
 * Add or update a user's grant authorizations on chain.
 * @deprecated Use useCheckAndUpdateGrants for a better all-in-one solution for requesting grants
 */
const useAddOrUpdateGrants = () => {
  const account = useActiveAccount();
  const {config: butterConfig} = useButterConfig();

  const getAuthzGrants = useGetAuthzGrants();
  const {navigate} = useNavigation<any>();
  const {t} = useTranslation();

  /**
   * Remove all user's grants and authorizations from chain.
   */
  const revokeGrants = React.useCallback(
    async (selectedGrants?: GrantEnums[]) => {
      if (!account) throw new Error('No active chain account found.');
      if (!butterConfig?.desmosAddress) {
        throw new Error('No granteeAddress found.');
      }

      const grantee = butterConfig?.desmosAddress;
      const granter = account.address;

      const grantsData = await getAuthzGrants();

      const {grants} = grantsData;
      const formattedGrants = grants.map(x => x.msg_type);
      const grantsToRevoke = selectedGrants || grants.map(x => x.msg_type);
      const remainingGrants = formattedGrants.filter(
        grant => !grantsToRevoke.includes(grant),
      );

      console.log('Revoking the following grants:', grantsToRevoke.join(', '));
      const msgRevokeAllowanceEncode = buildRevokeAllowanceEncode({
        grantee,
        granter,
      });

      const msgRevokeGrantEncode = buildRevokeGrantMsgEncodes({
        grantee,
        granter,
        grants: grantsToRevoke,
      });

      const msgGrantAllowanceEncode =
        remainingGrants.length !== 0
          ? buildGrantAllowanceEncode({
              grants: remainingGrants,
              grantee,
              granter,
            })
          : undefined;

      const unlockResult = await unlockWallet({chainAccount});

      if (!unlockResult) {
        throw new Error(
          'Error unlocking wallet or user cancelled authentication',
        );
      }

      const {wallet} = unlockResult;

      const combinedMessages = _.compact([
        msgRevokeAllowanceEncode,
        msgGrantAllowanceEncode,
        ...msgRevokeGrantEncode,
      ]);

      const broadcastResult = await broadcastMessages(
        wallet as OfflineSigner,
        combinedMessages,
      );

      if (!broadcastResult) {
        throw new Error('Error deleting grants');
      }

      navigate(ROUTES.TEXTONLY_MODAL, {
        title: t('common:success'),
        body: t('grants:successful revoke'),
        bodyStyle: {textAlign: 'center'},
        image: authorizationImage,
      });
    },
    [chainAccount, butterConfig?.desmos_address],
  );

  /**
   * All-in-one function that builds and broadcast a transaction as part of the
   * Granting Authorization flows outlined in the @link below.
   * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#Granting-authorizations
   * @param {GrantEnums[]} grantsToRequest - An array of grants to request.
   */
  const addOrUpdateGrants = React.useCallback(
    async ({grantsToRequest}: {grantsToRequest: GrantEnums[]}) => {
      if (!chainAccount) throw new Error('No active chain account found.');
      const grantsData = await getAuthzGrants();

      const {has_fee_grant} = grantsData;

      const grantee = butterConfig.desmos_address;
      const granter = chainAccount.address;
      const grants = grantsToRequest;

      /**
       * If user already has a fee grant, we need to revoke it by creating a MsgRevokeAllowanceEncodeObject
       * Otherwise, do nothing.
       */
      const msgRevokeAllowanceEncode:
        | MsgRevokeAllowanceEncodeObject
        | undefined = has_fee_grant
        ? buildRevokeAllowanceEncode({
            grantee,
            granter,
          })
        : undefined;

      const msgGrantAllowanceEncode = buildGrantAllowanceEncode({
        grants,
        grantee,
        granter,
      });

      const msgsGrantEncodes = buildGrantMsgEncodes({grants, grantee, granter});

      const unlockResult = await unlockWallet({chainAccount});

      if (!unlockResult) {
        throw new Error(
          'Error unlocking wallet or user cancelled authentication',
        );
      }

      const {wallet} = unlockResult;

      // compact to remove undefined message, as msgRevokeAllowanceEncode is undefined
      // if user does not have a fee grant
      const combinedMessages = _.compact([
        msgRevokeAllowanceEncode,
        msgGrantAllowanceEncode,
        ...msgsGrantEncodes,
      ]);

      const broadcastResult = await broadcastMessages(
        wallet as OfflineSigner,
        combinedMessages,
      );

      if (!broadcastResult) {
        throw new Error('Error requesting grants');
      }

      return true;
    },
    [chainAccount, butterConfig],
  );

  return {
    addOrUpdateGrants,
    revokeGrants,
  };
};

export default useAddOrUpdateGrants;

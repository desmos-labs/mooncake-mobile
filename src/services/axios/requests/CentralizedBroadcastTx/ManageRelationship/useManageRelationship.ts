import React from 'react';
import {
  DesmosClient,
  MsgCreateRelationshipEncodeObject,
  MsgDeleteRelationshipEncodeObject,
} from '@desmoslabs/desmjs';
import {
  MsgCreateRelationship,
  MsgDeleteRelationship,
} from '@desmoslabs/desmjs-types/desmos/relationships/v1/msg_server';
import useActiveAccount from 'hooks/useActiveAccount';
import {useToast} from 'react-native-toast-notifications';
import EnvConfig from 'config/EnvConfig';
import Long from 'long';
import {useTranslation} from 'react-i18next';
import ToastConfig from 'config/ToastConfig';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';
import {GrantEnums} from 'lib/desmos/msgtypes';

/**
 * A hook that wraps the CreateRelationship and DeleteRelationship flows
 */
const useManageRelationship = () => {
  const {activeAddress} = useActiveAccount();
  const {t} = useTranslation();

  const toast = useToast();

  const createRelationship = React.useCallback(
    async ({counterPartyAddr}: {counterPartyAddr: string}) => {
      if (!activeAddress) {
        return toast.show(t('error:systemBusy'), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }

      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const msg: MsgCreateRelationshipEncodeObject = {
          typeUrl: GrantEnums.MsgCreateRelationship,
          value: MsgCreateRelationship.fromPartial({
            signer: activeAddress,
            counterparty: counterPartyAddr,
            subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
          }),
        };

        const messages = client.encodeToAmino([msg]);

        return CentralizedBroadcastTx({
          messages,
        });
      } catch (err: any) {
        toast.show(err.toString(), {type: ToastConfig.ERROR_NO_RETRY});
      }
    },
    [activeAddress],
  );

  const deleteRelationship = React.useCallback(
    async ({counterPartyAddr}: {counterPartyAddr: string}) => {
      if (!activeAddress) {
        return toast.show(t('error:systemBusy'), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }

      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const msg: MsgDeleteRelationshipEncodeObject = {
          typeUrl: GrantEnums.MsgDeleteRelationship,
          value: MsgDeleteRelationship.fromPartial({
            signer: activeAddress,
            counterparty: counterPartyAddr,
            subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
          }),
        };

        const messages = client.encodeToAmino([msg]);

        return CentralizedBroadcastTx({
          messages,
        });
      } catch (err: any) {
        toast.show(err.toString(), {type: ToastConfig.ERROR_NO_RETRY});
      }
    },
    [activeAddress],
  );

  return {
    createRelationship,
    deleteRelationship,
  };
};

export default useManageRelationship;

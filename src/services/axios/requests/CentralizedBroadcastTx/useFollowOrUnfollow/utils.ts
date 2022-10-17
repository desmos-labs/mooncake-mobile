import {
  DesmosClient,
  MsgCreateRelationshipEncodeObject,
  MsgDeleteRelationshipEncodeObject,
} from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {
  MsgCreateRelationship,
  MsgDeleteRelationship,
} from '@desmoslabs/desmjs-types/desmos/relationships/v1/msgs';
import Long from 'long';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';

export const createRelationship = async ({
  counterPartyAddr,
  activeAddress,
}: {
  counterPartyAddr: string;
  activeAddress: string;
}) => {
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

  client.disconnect();

  return CentralizedBroadcastTx({
    messages,
  });
};

export const deleteRelationship = async ({
  counterPartyAddr,
  activeAddress,
}: {
  counterPartyAddr: string;
  activeAddress: string;
}) => {
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

  client.disconnect();

  return CentralizedBroadcastTx({
    messages,
  });
};

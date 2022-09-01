import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import GetNonce from 'services/axios/requests/GetNonce';
import {StdFee} from '@cosmjs/amino';
import {
  DesmosClient,
  MsgAuthenticateEncodeObject,
  OfflineSignerAdapter,
  getSignedBytes,
  getPubKeyBytes,
  getSignatureBytes,
} from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';
// @ts-ignore
import {TextEncoder} from 'text-encoding-polyfill';

const toHex = (data: Uint8Array) => Buffer.from(data).toString('hex');

// eslint-disable-next-line import/prefer-default-export
export const generateLoginData = async ({
  wallet,
  address,
}: {
  wallet: OfflineDirectSigner;
  address: string;
}): Promise<{
  signatureBytes: string;
  pubkeyBytes: string;
  signedBytes: string;
}> => {
  const {nonce} = await GetNonce({address});

  const msg: MsgAuthenticateEncodeObject = {
    value: {
      user: address,
      nonce: new TextEncoder().encode(nonce),
    },
    typeUrl: '/desmjs.v1.MsgAuthenticate',
  };

  const fee: StdFee = {
    amount: [],
    gas: '0',
  };

  const offlineSigner = new OfflineSignerAdapter(wallet);

  const desmosClient = await DesmosClient.connectWithSigner(
    EnvConfig.DESMOS_RPC,
    offlineSigner,
  );

  const result = await desmosClient.signTx(address, [msg], fee, nonce);

  return {
    signatureBytes: toHex(getSignatureBytes(result)),
    pubkeyBytes: toHex(getPubKeyBytes(result)),
    signedBytes: toHex(getSignedBytes(result)),
  };
};

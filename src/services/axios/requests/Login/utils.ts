import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import {SignerData} from '@cosmjs/stargate';
import GetNonce from 'services/axios/requests/GetNonce';
import {StdFee} from '@cosmjs/amino';
import {
  DesmosClient,
  OfflineSignerAdapter,
  getSignedBytes,
  getPubKeyBytes,
  getSignatureBytes,
} from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';
import {toHex} from '@cosmjs/encoding';

// eslint-disable-next-line import/prefer-default-export
export const generateLoginData = async ({
  wallet,
  address,
  signerData,
}: {
  wallet: OfflineDirectSigner;
  address: string;
  signerData?: SignerData;
}): Promise<{
  signatureBytes: string;
  pubkeyBytes: string;
  signedBytes: string;
}> => {
  const {nonce} = await GetNonce({address});

  // omitted as MsgAuthenticate is not a supported message type yet
  // if uncommenting, need to reinstall text-encoding polyfill using fast-text-encoder
  // const msg: MsgAuthenticateEncodeObject = {
  //   value: {
  //     user: address,
  //     nonce: new TextEncoder().encode(nonce),
  //   },
  //   typeUrl: '/desmjs.v1.MsgAuthenticate',
  // };

  const fee: StdFee = {
    amount: [],
    gas: '0',
  };

  const offlineSigner = new OfflineSignerAdapter(wallet);

  const desmosClient = await DesmosClient.connectWithSigner(
    EnvConfig.DESMOS_RPC,
    offlineSigner,
  );

  // Pass an empty array as message, as we just need to sign something
  // to grab the SignatureResult
  const result = await desmosClient.signTx(address, [], fee, nonce, signerData);

  return {
    signatureBytes: toHex(getSignatureBytes(result)),
    pubkeyBytes: toHex(getPubKeyBytes(result)),
    signedBytes: toHex(getSignedBytes(result)),
  };
};

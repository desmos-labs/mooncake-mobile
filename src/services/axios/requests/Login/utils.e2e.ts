import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import {SignerData} from '@cosmjs/stargate';

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
  console.log('mocked generateLoginData', wallet, address, signerData);
  // omitted as MsgAuthenticate is not a supported message type yet
  // if uncommenting, need to reinstall text-encoding polyfill using fast-text-encoder
  // const msg: MsgAuthenticateEncodeObject = {
  //   value: {
  //     user: address,
  //     nonce: new TextEncoder().encode(nonce),
  //   },
  //   typeUrl: '/desmjs.v1.MsgAuthenticate',
  // };

  return {
    signatureBytes: 'signatureBytes',
    pubkeyBytes: 'pubkeyBytes',
    signedBytes: 'signedBytes',
  };
};

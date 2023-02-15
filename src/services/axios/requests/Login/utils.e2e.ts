import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import {SignerData} from '@cosmjs/stargate';

/**
 * Mocked utils for e2e tests.
 */
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

  return {
    signatureBytes: 'signatureBytes',
    pubkeyBytes: 'pubkeyBytes',
    signedBytes: 'signedBytes',
  };
};

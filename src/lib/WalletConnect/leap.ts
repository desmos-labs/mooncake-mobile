import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { WalletConnectWalletApp } from 'types/wallet';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { ok } from 'neverthrow';
import { SignerStatus } from '@desmoslabs/desmjs';
import { StdSignDoc, AminoSignResponse } from '@cosmjs/amino';
import { AccountData, DirectSignResponse } from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Linking } from 'react-native';
import { WalletConnectModalController } from './modalController';
import WalletConnectSigner from './signer';

class LeapSigner extends WalletConnectSigner {
  private wcClient: SignClient;

  private readonly modalController = new WalletConnectModalController(WalletConnectWalletApp.Leap);

  private walletSession: SessionTypes.Struct | undefined;

  private accounts: AccountData[];

  constructor(client: SignClient) {
    super(WalletConnectWalletApp.Leap, client);
    this.wcClient = client;
    this.walletSession = undefined;
    this.accounts = [];
  }

  async connect(): Promise<void> {
    this.updateStatus(SignerStatus.Connecting);
    const requiredNamespaces = {
      cosmos: {
        methods: ['cosmos_getAccounts', 'cosmos_signAmino'],
        chains: ['cosmos:desmos-mainnet'],
        events: [],
      },
    };

    const connectResult = await promiseToResult(
      this.wcClient.connect({
        requiredNamespaces,
      }),
      'Unable to connect to the Desmos chain',
    );

    if (connectResult.isErr()) {
      this.updateStatus(SignerStatus.NotConnected);
      throw connectResult.error;
    }
    const response = connectResult.value;
    if (response.uri === undefined) {
      this.updateStatus(SignerStatus.NotConnected);
      throw new Error('Unable to connect to the Desmos chain');
    }

    this.modalController.open(response.uri, () => {
      this.updateStatus(SignerStatus.NotConnected);
    });

    const approveResult = await promiseToResult(response.approval(), 'Approve request rejected');
    if (approveResult.isErr()) {
      this.updateStatus(SignerStatus.NotConnected);
      throw approveResult.error;
    }

    const approveResponse = approveResult.value;
    this.walletSession = approveResponse;

    const resp: any[] = await this.wcClient.request({
      topic: this.walletSession.topic,
      chainId: 'cosmos:desmos-mainnet',
      request: {
        method: 'cosmos_getAccounts',
        params: {},
      },
    });

    this.accounts = resp.map<AccountData>(a => ({
      ...a,
      pubkey: new Uint8Array(Buffer.from(a.pubkey, 'base64')),
    }));

    this.updateStatus(SignerStatus.Connected);
  }

  async connectToSession(session: SessionTypes.Struct): Promise<void> {
    this.updateStatus(SignerStatus.Connecting);
    this.walletSession = session;

    this.accounts = await this.wcClient.request({
      topic: this.walletSession.topic,
      chainId: 'cosmos:desmos-mainnet',
      request: {
        method: 'cosmos_getAccounts',
        params: {},
      },
    });

    this.updateStatus(SignerStatus.Connected);
  }

  async disconnect(): Promise<void> {
    this.assertConnected();
    if (this.walletSession) {
      this.updateStatus(SignerStatus.Disconnecting);
      await this.wcClient
        .disconnect({
          topic: this.walletSession.topic,
          reason: { code: 0, message: 'User disconnected' },
        })
        .finally(() => {
          this.updateStatus(SignerStatus.NotConnected);
        });
    }
  }

  async getCurrentAccount(): Promise<AccountData | undefined> {
    this.assertConnected();
    return this.accounts[0];
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    this.assertConnected();
    return this.accounts;
  }

  async signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    this.assertConnected();
    if (this.walletSession === undefined) {
      throw new Error('LeapSigner not connected');
    }

    // Open the leap wallet app.
    setTimeout(() => Linking.openURL('leapcosmos://open'), 300);

    const resp = (await this.wcClient.request({
      topic: this.walletSession.topic,
      chainId: 'cosmos:desmos-mainnet',
      request: {
        method: 'cosmos_signAmino',
        params: {
          signerAddress,
          signDoc,
        },
      },
    })) as AminoSignResponse;

    return resp;
  }

  get session() {
    this.assertConnected();

    if (!this.walletSession) {
      throw new Error('The WalletConnect Session is undefined. This should not happen.');
    }

    return this.walletSession;
  }

  // eslint-disable-next-line class-methods-use-this
  signDirect(_signerAddress: string, _signDoc: SignDoc): Promise<DirectSignResponse> {
    throw new Error('signDirect not supported');
  }
}
// eslint-disable-next-line import/prefer-default-export
export const initLeapWalletConnectSigner = (client: SignClient) => {
  const signer = new LeapSigner(client);
  return ok(signer);
};

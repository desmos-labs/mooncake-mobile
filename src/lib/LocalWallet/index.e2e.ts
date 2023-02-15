import {
  AminoSignResponse,
  encodeSecp256k1Signature,
  OfflineAminoSigner,
  serializeSignDoc,
  StdSignDoc,
} from '@cosmjs/amino';
import {Secp256k1, sha256} from '@cosmjs/crypto';
import {fromHex, toBase64} from '@cosmjs/encoding';
import {
  AccountData,
  DirectSignResponse,
  makeSignBytes,
  OfflineDirectSigner,
} from '@cosmjs/proto-signing';
import * as bip39 from 'bip39';
import {SignDoc} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {CryptoUtils} from 'types/cryptoUtils';
import {DesmosHdPath, HdPath} from 'types/hdpath';

/**
 * E2E mocks for the LocalWallet class
 * This is temporary and will be replaced once the refactor branch is merged.
 */
export interface LocalWalletOptions {
  /**
   * Wallet HdPath.
   */
  hdPath?: HdPath;
  /**
   * Prefix of the bech32 address.
   */
  prefix?: string;
}

export const DEFAULT_WALLET_OPTIONS = {
  hdPath: DesmosHdPath,
  prefix: 'desmos',
};

export default class LocalWallet
  implements OfflineDirectSigner, OfflineAminoSigner
{
  private readonly prefix: string;

  private readonly privateKey: Uint8Array;

  readonly publicKey: Uint8Array;

  private readonly _address: string;

  /**
   *
   * @param prefix - Prefix of the bech32 address.
   * @param privateKey - The private key.
   * @param publicKey - The compressed public key.
   */
  constructor(prefix: string, privateKey: Uint8Array, publicKey: Uint8Array) {
    this.prefix = prefix;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this._address = 'desmos1qp3733x370mtx6e4ppfgn96u6049kk89krv7q9';
  }

  static async fromMnemonic(
    mnemonic: string,
    options?: LocalWalletOptions,
  ): Promise<LocalWallet> {
    const {hdPath, prefix} = {...DEFAULT_WALLET_OPTIONS, ...options};
    const {privkey, pubkey} = await CryptoUtils.deriveKeyPairFromMnemonic(
      mnemonic,
      hdPath.coinType,
      hdPath.account,
      hdPath.change,
      hdPath.addressIndex,
    );
    const privkeyBytes = fromHex(privkey);
    const pubkeyBytes = fromHex(pubkey);
    const compressedPubKey = await Secp256k1.compressPubkey(pubkeyBytes);
    return new LocalWallet(prefix, privkeyBytes, compressedPubKey);
  }

  async sign(payload: Uint8Array): Promise<Uint8Array> {
    const hashedMessage = sha256(payload);
    const signature = await Secp256k1.createSignature(
      hashedMessage,
      this.privateKey,
    );
    return new Uint8Array([...signature.r(32), ...signature.s(32)]);
  }

  public get bech32Address(): string {
    return this._address;
  }

  public serialize(): string {
    const json = {
      version: 3,
      privateKey: toBase64(this.privateKey),
      publicKey: toBase64(this.publicKey),
      prefix: this.prefix,
    };
    return JSON.stringify(json);
  }

  public static async deserialize(_: string): Promise<LocalWallet> {
    return new LocalWallet(
      'desmos',
      new Uint8Array([1, 2, 3, 4, 5]),
      new Uint8Array([1, 2, 3, 4, 5]),
    );
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc,
  ): Promise<DirectSignResponse> {
    if (signerAddress !== this.bech32Address) {
      throw new Error('Signer address not valid');
    }

    const serialized = makeSignBytes(signDoc);
    const signature = await this.sign(serialized);
    const stdSignature = encodeSecp256k1Signature(
      Uint8Array.from(this.publicKey),
      signature,
    );
    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    const data: AccountData = {
      address: this.bech32Address,
      algo: 'secp256k1',
      pubkey: this.publicKey,
    };
    return [data];
  }

  async signAmino(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    if (signerAddress !== this.bech32Address) {
      throw new Error('Signer address not valid');
    }

    const serializedSignDoc = serializeSignDoc(signDoc);
    const signature = await this.sign(serializedSignDoc);

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(this.publicKey, signature),
    };
  }
}

export function randomMnemonic(wordCount = 24): string {
  if (wordCount !== 12 && wordCount !== 24) {
    throw new Error('Can be generated mnemonic only with length 24 or 12');
  }

  const strength = wordCount === 24 ? 256 : 128;
  return bip39.generateMnemonic(strength);
}

export function checkMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

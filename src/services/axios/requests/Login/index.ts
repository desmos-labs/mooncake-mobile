import axiosInstance from 'services/axios';
import { ResultAsync } from 'neverthrow';

export interface LoginParams {
  /**
   * Address of the user logging in
   */
  readonly address: string;

  /**
   * Hex-encoded bytes of the public key associated to the private key used to sign the transaction
   */
  readonly pubkeyBytes: string;

  /**
   * Hex-encoded bytes of the signed transaction
   */
  readonly signedBytes: string;

  /**
   * Hex-encoded result of the signature
   */
  readonly signatureBytes: string;
}

/**
 * Login and retrieve a token
 */
const Login = ({
  address,
  pubkeyBytes,
  signedBytes,
  signatureBytes,
}: LoginParams): ResultAsync<string, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.post('/login', {
      desmos_address: address,
      pubkey_bytes: pubkeyBytes,
      signed_bytes: signedBytes,
      signature_bytes: signatureBytes,
    }),

    // Safe to ignore, axios will raise an Error in case the request fails.
    // @ts-ignore
    e => Error(e?.message ?? 'Error performing the login'),
  ).map(response => response.data.token);
};

export default Login;

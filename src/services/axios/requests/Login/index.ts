import axiosInstance from 'services/axios';

type Response = {
  token: string;
};

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
const Login = async ({
  address,
  pubkeyBytes,
  signedBytes,
  signatureBytes,
}: LoginParams): Promise<Response> => {
  const _response = await axiosInstance.post('/login', {
    desmos_address: address,
    pubkey_bytes: pubkeyBytes,
    signed_bytes: signedBytes,
    signature_bytes: signatureBytes,
  });

  return _response.data;
};

export default Login;

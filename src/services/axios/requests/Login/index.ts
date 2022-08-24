import axiosInstance from 'services/axios';

type Response = {
  token: string;
};

type Params = {
  /**
   * Address of the user logging in
   */
  address: string;

  /**
   * Hex-encoded bytes of the public key associated to the private key used to sign the transaction
   */
  pubkeyBytes: Uint8Array;

  /**
   * Hex-encoded bytes of the signed transaction
   */
  signedBytes: Uint8Array;

  /**
   * Hex-encoded result of the signature
   */
  signatureBytes: Uint8Array;
};

/**
 * Login and retrieve a token
 */
const Login = async ({
  address,
  pubkeyBytes,
  signedBytes,
  signatureBytes,
}: Params): Promise<Response> => {
  const _response = await axiosInstance.post('/login', {
    desmos_address: address,
    pubkey_bytes: pubkeyBytes,
    signed_bytes: signedBytes,
    signature_bytes: signatureBytes,
  });

  return _response.data;
};

export default Login;

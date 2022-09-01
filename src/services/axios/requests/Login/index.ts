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
  pubkeyBytes: string;

  /**
   * Hex-encoded bytes of the signed transaction
   */
  signedBytes: string;

  /**
   * Hex-encoded result of the signature
   */
  signatureBytes: string;
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
  console.log({
    address,
    pubkeyBytes,
    signedBytes,
    signatureBytes,
  });

  console.log('test', {
    desmos_address: address,
    pubkey_bytes: pubkeyBytes,
    signed_bytes: signedBytes,
    signature_bytes: signatureBytes,
  });

  const _response = await axiosInstance.post('/login', {
    desmos_address: address,
    pubkey_bytes: pubkeyBytes,
    signed_bytes: signedBytes,
    signature_bytes: signatureBytes,
  });

  console.log(_response.response.data);

  return _response.data;
};

export default Login;

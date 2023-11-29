import { OPENLOGIN_NETWORK, SdkLoginParams, Web3Auth } from '@desmoslabs/desmjs-web3auth-mobile';
import * as SecureStorage from 'expo-secure-store';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Web3AuthLoginProvider } from 'types/web3auth';
import EnvConfig from 'config/EnvConfig';

// Remember to change this value also in android/app/src/main/AndroidManifest.xml.
export const Web3authScheme = 'bondscapeweb3auth';
export const Web3authResolveRedirectUrl = makeRedirectUri({
  scheme: Web3authScheme,
  path: 'openlogin',
});

export const newWeb3AuthClient = () =>
  new Web3Auth(WebBrowser, SecureStorage, {
    clientId: EnvConfig.WEB3_AUTH_CLIENT_ID_MAINNET,
    network: OPENLOGIN_NETWORK.CYAN,
  });

export const web3AuthLoginParams = (
  loginProvider: Web3AuthLoginProvider,
): Omit<SdkLoginParams, 'curve'> => ({
  loginProvider,
  redirectUrl: Web3authResolveRedirectUrl,
});

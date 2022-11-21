import axios from 'axios';
import EnvConfig from 'config/EnvConfig';
import {deleteMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import _ from 'lodash';
import ROUTES from 'navigation/routes';

const axiosInstance = axios.create({
  baseURL: EnvConfig.DESMOS_REST,
  timeout: 15000,
});

/**
 * Updates the bearer token of the axios instance and also saves it to MMKV storage.
 */
export const updateAuthToken = (newToken: string) => {
  setMMKV(MMKVKEYS.REST_AUTH_TOKEN, newToken);

  axiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${newToken}`,
  };
};

export const deleteAuthToken = () => {
  deleteMMKV(MMKVKEYS.REST_AUTH_TOKEN);

  axiosInstance.defaults.headers.common = {
    Authorization: '',
  };
};

// Some possible token related error messages
const invalidAuthMsgs = ['Wrong Authorization header value', 'Invalid token'];

type NavProps = StackScreenProps<RootNavigatorParamList, any>;
// A hook that augments the interceptors of the axiosInstance with react hook
// functionality
export const useInitializeAxios = () => {
  const {navigate} = useNavigation<NavProps['navigation']>();

  React.useEffect(() => {
    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        const responseMsg = _.get(error, 'response.data');

        if (invalidAuthMsgs.includes(responseMsg)) {
          navigate(ROUTES.LOGIN);
          return Promise.reject(error);
        } else {
          console.warn(`[AXIOS]: ${responseMsg}`);
          return Promise.reject(error);
        }
      },
    );
  }, []);
};

export default axiosInstance;

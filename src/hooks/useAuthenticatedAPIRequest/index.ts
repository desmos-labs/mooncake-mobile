import React from 'react';
import _ from 'lodash';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {LoginParams} from 'screens/Login';

// Some possible token related error messages
const invalidAuthMsgs = ['Wrong Authorization header value', 'Invalid Token'];

type NavProps = StackScreenProps<RootNavigatorParamList, any>;

const useAuthenticatedAPIRequest = () => {
  const {navigate} = useNavigation<NavProps['navigation']>();

  return React.useCallback(
    async ({
      request,
      onSuccessOptions,
      onErrorOverride,
    }: {
      request: () => Promise<any>;
      onSuccessOptions?: Pick<LoginParams, 'onSuccess' | 'noPop'>;
      onErrorOverride?: () => void;
    }) => {
      try {
        return request();
      } catch (err: any) {
        const responseMsg = _.get(err, 'response.data');
        console.log(
          '[useAuthenticatedAPIRequest]:',
          responseMsg,
          err?.response?.data,
        );
        if (onErrorOverride) {
          onErrorOverride();
        } else if (invalidAuthMsgs.includes(responseMsg)) {
          navigate(ROUTES.LOGIN, onSuccessOptions);
        }
      }
    },
    [],
  );
};

export default useAuthenticatedAPIRequest;

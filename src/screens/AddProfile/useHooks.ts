import {useRoute} from '@react-navigation/native';
import _ from 'lodash';
import React from 'react';
import {
  generateAccountUsingLedger,
  generateAccountUsingMnemonic,
  generateHdPaths,
} from 'screens/ConnectAddress/utils';
import {DESMOS_COIN_TYPE} from 'types/hdpath';

const useHooks = () => {
  const {params} = useRoute<any>();
  const ledgerTransport = _.get(params, 'ledgerTransport');
  const ledgerApp = _.get(params, 'ledgerApp');
  const isUsingLedger = !!(ledgerTransport && ledgerApp);

  const generateAccounts = React.useCallback(
    async (startingIndex: number, limit: number, mnemonic?: string) => {
      const hdPaths = generateHdPaths({
        startingIndex: startingIndex || 0,
        coinType: DESMOS_COIN_TYPE,
        limit,
      });
      let _accounts: any;
      if (isUsingLedger) {
        _accounts = await generateAccountUsingLedger({
          ledgerApp,
          ledgerTransport,
          prefix: 'desmos',
          hdPaths,
        });
      } else {
        _accounts = await generateAccountUsingMnemonic({
          prefix: 'desmos',
          hdPaths,
          mnemonic: mnemonic!,
        });
      }

      if (_accounts) {
        return _accounts;
      }
    },
    [isUsingLedger],
  );

  return {
    generateAccounts,
  };
};

export default useHooks;

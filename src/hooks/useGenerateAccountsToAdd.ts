import { useRoute } from '@react-navigation/native';
import _ from 'lodash';
import React from 'react';
import {
  generateAccountUsingLedger,
  generateAccountUsingMnemonic,
  generateHdPaths,
} from 'screens/ConnectAddress/utils';
import { DESMOS_COIN_TYPE, HdPath } from 'types/hdpath';

const useGenerateAccountsToAdd = () => {
  const { params } = useRoute<any>();
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

  const generateAccount = React.useCallback(
    async (change: number, account: number, addressIndex: number, mnemonic?: string) => {
      const hdPath: HdPath = {
        coinType: DESMOS_COIN_TYPE,
        change,
        account,
        addressIndex,
      };

      let _accounts: any;
      if (isUsingLedger) {
        /*        _accounts = await generateAccountUsingLedger({
         ledgerApp,
         ledgerTransport,
         prefix: 'desmos',
         hdPath,
         }); */
      } else {
        _accounts = await generateAccountUsingMnemonic({
          prefix: 'desmos',
          hdPaths: [hdPath],
          mnemonic: mnemonic!,
        });
      }

      if (_accounts) {
        return _accounts[0];
      }
    },
    [isUsingLedger],
  );

  return {
    generateAccounts,
    generateAccount,
  };
};

export default useGenerateAccountsToAdd;

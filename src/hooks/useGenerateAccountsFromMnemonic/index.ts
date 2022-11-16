import {useRoute} from '@react-navigation/native';
import {ExternalAccount} from '@recoil/connectChainState';
import _ from 'lodash';
import React from 'react';
import {
  generateAccountUsingLedger,
  generateAccountUsingMnemonic,
  generateHdPaths,
} from 'screens/ConnectAddress/utils';
import {DESMOS_COIN_TYPE} from 'types/hdpath';

const DESMOS_PREFIX = 'desmos';

/**
 * Generate desmos accounts given a mnemonic
 */
const useGenerateAccountsFromMnemonic = (mnemonic?: string) => {
  const [accounts, setAccounts] = React.useState<ExternalAccount[]>([]);
  const [loading, setLoading] = React.useState(false);
  const prefix = DESMOS_PREFIX;
  const coinType = DESMOS_COIN_TYPE;
  const {params} = useRoute<any>();
  const ledgerTransport = _.get(params, 'ledgerTransport');
  const ledgerApp = _.get(params, 'ledgerApp');

  const isUsingLedger = !!(ledgerTransport && ledgerApp);

  const generateAccounts = React.useCallback(
    async (limit: number, startingIndex?: number) => {
      if (loading) return;
      setLoading(true);
      console.log('start', startingIndex);
      console.log('end', limit);
      const hdPaths = generateHdPaths({
        startingIndex: startingIndex || 0,
        coinType,
        limit,
      });
      let _accounts: any;
      if (isUsingLedger) {
        _accounts = await generateAccountUsingLedger({
          ledgerApp,
          ledgerTransport,
          prefix,
          hdPaths,
        });
      } else {
        _accounts = await generateAccountUsingMnemonic({
          prefix,
          hdPaths,
          mnemonic: mnemonic!,
        });
      }

      setLoading(false);
      if (_accounts) {
        setAccounts(prev => [...prev, ..._accounts]);
      }
    },
    [loading, mnemonic],
  );

  return {
    accounts,
    loading,
    generateAccounts,
  };
};

export default useGenerateAccountsFromMnemonic;

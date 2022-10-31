import React from 'react';
import {HdPath} from 'types/hdpath';
import {
  generateAccountUsingLedger,
  generateAccountUsingMnemonic,
  generateHdPaths,
} from 'screens/ConnectAddress/utils';
import {connectChainState, ExternalAccount} from '@recoil/connectChainState';
import {useRoute} from '@react-navigation/native';
import _ from 'lodash';
import {useRecoilValue} from 'recoil';
import {NavProps} from './General';

const useGenerateAccounts = () => {
  const [accounts, setAccounts] = React.useState<ExternalAccount[]>([]);
  const [loading, setLoading] = React.useState(false);

  const {selectedChain, mnemonic} = useRecoilValue(connectChainState);

  const {
    prefix,
    hdPath: {coinType},
  } = selectedChain;

  const {params} = useRoute<NavProps['route']>();
  const ledgerTransport = _.get(params, 'ledgerTransport');
  const ledgerApp = _.get(params, 'ledgerApp');

  const isUsingLedger = !!(ledgerTransport && ledgerApp);

  const generateAccount = React.useCallback(
    async ({
      change,
      account,
      addressIndex,
    }: {
      change: number;
      account: number;
      addressIndex: number;
    }) => {
      if (loading) return;

      const hdPath: HdPath = {
        coinType,
        change,
        account,
        addressIndex,
      };

      setLoading(true);
      let _accounts;
      if (isUsingLedger) {
        _accounts = await generateAccountUsingLedger({
          ledgerApp,
          ledgerTransport,
          prefix,
          hdPaths: [hdPath],
        });
      } else {
        _accounts = await generateAccountUsingMnemonic({
          prefix,
          hdPaths: [hdPath],
          mnemonic: mnemonic!,
        });
      }

      setAccounts(_accounts);
      setLoading(false);
    },
    [loading],
  );

  const generateAccounts = React.useCallback(
    async (limit: number) => {
      if (loading) return;
      setLoading(true);
      const hdPaths = generateHdPaths({
        startingIndex: accounts.length,
        coinType,
        limit,
      });

      let _accounts: ExternalAccount[];
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
      setAccounts(prev => [...prev, ..._accounts]);
    },
    [accounts, loading],
  );

  return {
    accounts,
    loading,
    generateAccount,
    generateAccounts,
  };
};

export default useGenerateAccounts;

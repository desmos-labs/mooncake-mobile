import React from 'react';
import {
  generateAccountUsingLedger,
  generateAccountUsingMnemonic,
  generateHdPaths,
} from 'screens/ConnectAddress/utils';
import {useRoute} from '@react-navigation/native';
import _ from 'lodash';
import {ExternalAccount} from '@recoil/connectChainState';
import {NavProps} from './index';

type Args = {
  /**
   * The bech32 prefix of the generated accounts
   */
  prefix: string;

  /**
   * Optional cointype.
   * @default 852
   */
  coinType?: number;

  mnemonic?: string;
};

/**
 * A hook that generates accounts from a mnemonic. It maintains a the state
 * of generated accounts, so it can be used on pages that require
 * dynamic account generation (i.e lists)
 */
const useGenerateAccounts = ({prefix, coinType = 852, mnemonic}: Args) => {
  const [accounts, setAccounts] = React.useState<ExternalAccount[]>([]);
  const [loading, setLoading] = React.useState(false);

  const {params} = useRoute<NavProps['route']>();

  const ledgerTransport = _.get(params, 'ledgerTransport');
  const ledgerApp = _.get(params, 'ledgerApp');

  const isUsingLedger = ledgerTransport && ledgerApp;

  React.useEffect(() => {
    generateMoreAccounts().then();
  }, []);

  const generateMoreAccounts = React.useCallback(async () => {
    setLoading(true);
    const hdPaths = generateHdPaths({
      startingIndex: accounts.length,
      coinType,
      limit: isUsingLedger ? 5 : 20,
    });

    let _accounts;
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
    setAccounts(_accounts);
  }, [accounts]);

  return {
    accounts,
    generateMoreAccounts,
    loading,
  };
};

export default useGenerateAccounts;

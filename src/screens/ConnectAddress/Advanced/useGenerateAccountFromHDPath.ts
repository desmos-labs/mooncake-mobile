import React from 'react';
import {HdPath} from 'types/hdpath';
import {
  generateAccountUsingLedger,
  generateAccountUsingMnemonic,
} from 'screens/ConnectAddress/utils';
import {ExternalAccount} from '@recoil/connectChainState';
import {useRoute} from '@react-navigation/native';
import _ from 'lodash';
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

const useGenerateAccountFromHDPath = ({
  prefix,
  coinType = 852,
  mnemonic,
}: Args) => {
  const [generatedAccount, setGeneratedAccount] =
    React.useState<ExternalAccount>();

  const {params} = useRoute<NavProps['route']>();
  const ledgerTransport = _.get(params, 'ledgerTransport');
  const ledgerApp = _.get(params, 'ledgerApp');

  const isUsingLedger = !!(ledgerTransport && ledgerApp);

  const [generating, setGenerating] = React.useState(false);

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
      const hdPath: HdPath = {
        coinType,
        change,
        account,
        addressIndex,
      };

      setGenerating(true);
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

      setGeneratedAccount(_accounts[0]);
      setGenerating(false);
    },
    [],
  );

  return {
    generatedAccount,
    generating,
    generateAccount,
  };
};

export default useGenerateAccountFromHDPath;

import {AccountData} from '@cosmjs/amino';
import {toBase64} from '@cosmjs/encoding';
import {OfflineSigner} from '@cosmjs/proto-signing';
import {StackActions} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import ErrorBoundary from 'components/ErrorBoundary';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, Suspense, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native-paper';
import {ChainAccount, ChainAccountType} from 'types/chains';
import Content from './components/Content';
import useStyles from './useStyles';

type AddProfileProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ADD_PROFILE
>;

export type AddProfileParams = {
  signer?: OfflineSigner;
  mnemonic?: string;
};

const MAX_NUM_OF_PROFILES = 100; // TODO: need multiple queries to retreive more than 100 profiles

/* A React component for the Add Profile screen. */
const AddProfile: FC<AddProfileProps> = ({navigation, route}) => {
  const {signer, mnemonic} = route?.params ?? {};
  const {dispatch} = navigation;
  const {t} = useTranslation('');
  const styles = useStyles();

  const unlockWallet = useUnlockWallet();
  const {chainAccount} = useActiveAccount();
  const [accounts, setAccounts] = useState<ChainAccount[]>([]);

  /* Using the unlockWallet function to unlock the wallet. */
  useEffect(() => {
    if (!chainAccount) return;

    if (signer) return; // already unlocked

    (async () => {
      const shouldReplaceRoute = true;
      const titleLabelOverride = t('addProfile:title');
      const buttonLabelOverride = t('common:next');
      const dViewProps = {
        topBar: <TopBar style={styles.topBar} />,
        backgroundColor: 'transparent',
        style: styles.dView,
      };
      const res = await unlockWallet(
        chainAccount,
        shouldReplaceRoute,
        titleLabelOverride,
        buttonLabelOverride,
        dViewProps,
      );

      // ledger cancelled
      if (!res?.wallet) {
        return dispatch(StackActions.pop());
      }

      // unlocked
      dispatch(
        StackActions.replace(ROUTES.ADD_PROFILE, {
          signer: res.wallet,
          mnemonic: res.mnemonic,
        }),
      );
    })();
  }, [chainAccount, signer]);
  useEffect(() => {
    if (!signer) return;
    (async () => {
      const chainAccounts = toChainAccounts(await signer.getAccounts());
      setAccounts(chainAccounts.slice(0, MAX_NUM_OF_PROFILES));
    })();
  }, [signer]);

  return (
    <DView
      style={styles.container}
      scrollable={false}
      topBar={<TopBar style={styles.topBar} />}>
      <Typography.H3 style={styles.title}>
        {t('addProfile:title')}
      </Typography.H3>
      <ErrorBoundary
        fallback={
          <Typography.H3 style={styles.title}>
            {t('common:oopsSomethingWentWrongPleaseTryAgainLater')}
          </Typography.H3>
        }>
        <Suspense fallback={<ActivityIndicator />}>
          {signer && accounts?.length ? (
            <Content mnemonic={mnemonic} accounts={accounts} />
          ) : (
            <ActivityIndicator />
          )}
        </Suspense>
      </ErrorBoundary>
    </DView>
  );
};

/**
 * It takes an array of AccountData objects and returns an array of ChainAccount objects
 * @param accountDatas - Readonly<AccountData[]>
 * @returns An array of ChainAccounts
 */
function toChainAccounts(
  accountDatas: Readonly<AccountData[]>,
): ChainAccount[] {
  if (!accountDatas) return [];

  return accountDatas
    .filter(({address}) => address)
    .map(accountData => {
      const hdPath = {
        coinType: 852,
        account: 0,
        change: 0,
        addressIndex: 0,
      };
      const chainAccount: ChainAccount = {
        address: accountData.address,
        signAlgorithm: accountData.algo,
        hdPath,
        type: ChainAccountType.Ledger,
        pubKey: toBase64(accountData.pubkey),
      };
      return chainAccount;
    });
}

export default AddProfile;

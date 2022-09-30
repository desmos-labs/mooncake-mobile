import {toBase64} from '@cosmjs/encoding';
import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import ErrorBoundary from 'components/ErrorBoundary';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, Suspense, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native-paper';
import {
  mnemonicState,
  selectedChainState,
  signerState,
} from '@recoil/connectChainState';
import {useRecoilState, useSetRecoilState} from 'recoil';
import createLocalWalletState from '@recoil/createLocalWalletState';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import {ChainAccountType} from 'types/chains';
import useStyles from './useStyles';
import Content from './components/Content';
import desmosChain from './desmosChain';

/* The number of profiles that will be displayed on the screen. */
export const PROFILE_PER_PAGE = 100;

/* This is the maximum number of pages that will be loaded. */
export const MAX_PAGE_TO_LOAD = 50;

type AddProfileProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ADD_PROFILE
>;

/* A React component for the Add Profile screen. */
const AddProfile: FC<AddProfileProps> = ({navigation}) => {
  const {pop, replace} = navigation;

  const {t} = useTranslation();
  const styles = useStyles();

  const unlockWallet = useUnlockWallet();
  const {chainAccount} = useActiveAccount();

  const [signer, setSigner] = useRecoilState(signerState);
  const [mnemonic, setMnemonic] = useRecoilState(mnemonicState);
  const setSelectedChain = useSetRecoilState(selectedChainState);

  const setCreateLocalWallet = useSetRecoilState(createLocalWalletState);
  const setCreateLedgerAccount = useSetRecoilState(createLedgerAccountState);

  const isWalletUnlocked = !!signer;

  /* Using the unlockWallet function to unlock the wallet. */
  useEffect(() => {
    if (isWalletUnlocked) return; // already unlocked

    if (!chainAccount) return; // wait for async load

    (async () => {
      const shouldReplaceRoute = true;
      const titleLabelOverride = t('addProfile:title');
      const buttonLabelOverride = t('common:next');
      const dViewProps = {
        topBar: <TopBar style={styles.topBar} />,
        backgroundColor: 'transparent',
        style: styles.dView,
      };

      const res = await unlockWallet({
        chainAccount,
        shouldReplaceRoute,
        enterPwScreenOptions: {
          titleLabelOverride,
          buttonLabelOverride,
          dViewProps,
        },
      });

      // ledger cancelled
      if (!res?.wallet) {
        return pop();
      }

      const {wallet, mnemonic: mnemonicRes} = res;

      // unlocked
      setSigner(wallet);

      if (mnemonicRes) {
        setMnemonic(mnemonicRes);
        setCreateLocalWallet(prev => ({
          ...prev,
          mnemonic: mnemonicRes,
          useExternalAccount: true,
        }));
      } else {
        const accounts = await wallet.getAccounts();
        if (!accounts.length) return;
        setCreateLedgerAccount(prev => ({
          ...prev,
          account: {
            type: ChainAccountType.Ledger,
            address: accounts[0].address,
            hdPath: desmosChain().hdPath, // TO DO: add ledger support
            pubKey: toBase64(accounts[0].pubkey),
            signAlgorithm: accounts[0].algo,
          },
          useExternalAccount: true,
        }));
      }
      setSelectedChain(desmosChain());

      replace(ROUTES.ADD_PROFILE);
    })();
  }, [isWalletUnlocked, chainAccount]);

  return (
    <DView
      style={styles.container}
      topBar={<TopBar style={styles.topBar} />}
      scrollable={false}
      disableHideKeyboardTouchable={true}>
      <Typography.H3 style={styles.title}>
        {t('addProfile:availableProfiles')}
      </Typography.H3>
      <ErrorBoundary
        fallback={
          <Typography.H3 style={styles.title}>
            {t('common:oopsSomethingWentWrongPleaseTryAgainLater')}
          </Typography.H3>
        }>
        <Suspense fallback={<ActivityIndicator />}>
          {isWalletUnlocked ? (
            <Content signer={signer} mnemonic={mnemonic} />
          ) : (
            <ActivityIndicator />
          )}
        </Suspense>
      </ErrorBoundary>
    </DView>
  );
};

export default AddProfile;

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
import {StackActions} from '@react-navigation/native';
import {OfflineSigner} from '@cosmjs/proto-signing';
import useStyles from './useStyles';
import Content from './components/Content';

type AddProfileProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ADD_PROFILE
>;

/**
 * `AddProfileParams` is an object with optional properties `signer` and `mnemonic`.
 * @property {OfflineSigner} signer - The signer to use for the profile.
 * @property {string} mnemonic - The mnemonic phrase to use for the new profile.
 */
export type AddProfileParams = {
  signer?: OfflineSigner;
  mnemonic?: string;
};

/* A React component for the Add Profile screen. */
const AddProfile: FC<AddProfileProps> = ({navigation, route}) => {
  const {signer, mnemonic} = route?.params ?? {};
  const {dispatch} = navigation;

  const {t} = useTranslation();
  const styles = useStyles();

  const unlockWallet = useUnlockWallet();
  const {chainAccount} = useActiveAccount();

  const isWalletUnlocked = !!signer;

  /* Using the unlockWallet function to unlock the wallet. */
  useEffect(() => {
    if (!chainAccount) return; // wait for async load

    if (isWalletUnlocked) return; // already unlocked

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
          accountType: chainAccount.type,
          signAlgorithm: chainAccount.signAlgorithm,
        }),
      );
    })();
  }, [chainAccount, isWalletUnlocked]);

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

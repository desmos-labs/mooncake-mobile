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
import React, {FC, Suspense, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native-paper';
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

/* A React component for the Add Profile screen. */
const AddProfile: FC<AddProfileProps> = ({navigation, route}) => {
  const {signer, mnemonic} = route?.params ?? {};
  const {dispatch} = navigation;
  const {t} = useTranslation('');
  const styles = useStyles();

  const unlockWallet = useUnlockWallet();
  const {chainAccount} = useActiveAccount();

  /* Using the unlockWallet function to unlock the wallet. */
  useEffect(() => {
    if (!chainAccount) return; // will change to non-null value after async call

    if (signer) return; // already unlocked

    const shouldReplaceRoute = true;
    const titleLabelOverride = t('addProfile:title');
    const buttonLabelOverride = t('common:next');
    const dViewProps = {
      topBar: <TopBar style={styles.topBar} />,
      backgroundColor: 'transparent',
      style: styles.dView,
    };
    unlockWallet(
      chainAccount,
      shouldReplaceRoute,
      titleLabelOverride,
      buttonLabelOverride,
      dViewProps,
    ).then(res => {
      if (!res?.wallet) {
        // ledger cancelled
        return dispatch(StackActions.pop());
      }

      // unlocked
      dispatch(
        StackActions.replace(ROUTES.ADD_PROFILE, {
          signer: res.wallet,
          mnemonic: res.mnemonic,
        }),
      );
    });
  }, [chainAccount, signer]);

  if (!signer) return <ActivityIndicator />;

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
          <Content signer={signer} mnemonic={mnemonic} />
        </Suspense>
      </ErrorBoundary>
    </DView>
  );
};

export default AddProfile;

import {OfflineSigner} from '@cosmjs/proto-signing';
import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import ErrorBoundary from 'components/ErrorBoundary';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {ViewStyle} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Content from './components/Content';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ADD_PROFILE>;

export type AddProfileParams = {
  signer: OfflineSigner;
  mnemonic: string;
};

const addProfileTopBarStyle: ViewStyle = {
  backgroundColor: 'transparent',
  shadowOpacity: 0,
};

/* A React component for the Add Profile screen. */
const AddProfile: FC<NavProps> = ({route}) => {
  const {signer, mnemonic} = route.params;
  const {t} = useTranslation('');
  const styles = useStyles();
  useUnlockWallet();
  return (
    <DView
      style={styles.container}
      scrollable={false}
      topBar={<TopBar style={addProfileTopBarStyle} />}>
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

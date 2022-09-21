import {
  Header,
  StackHeaderProps,
  StackScreenProps,
} from '@react-navigation/stack';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator} from 'react-native-paper';
import ErrorBoundary from 'components/ErrorBoundary';
import useUnlockWallet from 'hooks/useUnlockWallet';
import DView from 'components/DView';
import useStyles from './useStyles';
import Content from './components/Content';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ADD_PROFILE>;

const HeaderBackImage = () => {
  const styles = useStyles();
  return (
    <Icon
      name="angle-left"
      color="black"
      size={24}
      allowFontScaling
      style={styles.headerBackImage}
    />
  );
};

/* A React component that renders the header for the Add Profile screen. */
export const AddProfileHeader: FC<StackHeaderProps> = ({options, ...rest}) => {
  const styles = useStyles();
  return (
    <Header
      {...rest}
      options={{
        ...options,
        title: '',
        headerShadowVisible: false,
        headerStyle: styles.header,
        headerBackImage: HeaderBackImage,
        headerBackTitleVisible: false,
      }}
    />
  );
};

/* A React component for the Add Profile screen. */
const AddProfile: FC<NavProps> = () => {
  const {t} = useTranslation('');
  const styles = useStyles();
  useUnlockWallet();
  return (
    <DView style={styles.container} scrollable={false}>
      <Typography.H3 style={styles.title}>
        {t('addProfile:title')}
      </Typography.H3>
      <ErrorBoundary
        fallback={
          <Typography.H1 style={styles.title}>
            {t('common:oopsSomethingWentWrongPleaseTryAgainLater')}
          </Typography.H1>
        }>
        <Suspense fallback={<ActivityIndicator />}>
          <Content />
        </Suspense>
      </ErrorBoundary>
    </DView>
  );
};

export default AddProfile;

import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Content from './components/Content';
import useStyles from './useStyles';

export interface AddProfileParams {
  mnemonic: string;
  password: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ADD_PROFILE>;

const AddProfile = () => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    params: { mnemonic, password },
  } = useRoute<NavProps['route']>();

  return (
    <DView
      style={styles.container}
      topBar={<TopBar style={styles.topBar} />}
      scrollable={false}
      disableHideKeyboardTouchable={true}>
      <Typography.H3 style={styles.title}>{t('addProfile:availableProfiles')}</Typography.H3>
      <Content mnemonic={mnemonic} password={password} />
    </DView>
  );
};

export default AddProfile;

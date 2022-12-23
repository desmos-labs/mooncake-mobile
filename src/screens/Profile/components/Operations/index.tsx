import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import useHooks from './useHooks';
import useStyles from './useStyles';

export interface OperationsParams {
  address: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.OPERATIONS>;

const Operations = () => {
  const {t} = useTranslation('operations');
  const theme = useTheme();
  const styles = useStyles();
  const {params} = useRoute<NavProps['route']>();
  const {convertedBalance} = useHooks(params.address);

  return (
    <DView
      topBar={<TopBar />}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      style={styles.container}>
      <Typography.Body5>
        {convertedBalance?.balance?.denom.toUpperCase()} {t('balance')}
      </Typography.Body5>
      <Typography.H2>
        {convertedBalance?.balance?.amount}{' '}
        {convertedBalance?.balance?.denom.toUpperCase()}
      </Typography.H2>
      <Spacer paddingVertical={theme.spacing.s} />
      <Typography.H5>{t('operations')}</Typography.H5>
      <Spacer paddingVertical={theme.spacing.s} />
      <Typography.Body7>Coming soon...</Typography.Body7>
      {/*      <SectionList
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        sections={operationsData}
        renderItem={renderNotification}
        renderSectionHeader={({section: {section}}) => (
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.white,
              paddingTop: theme.spacing.m,
              paddingBottom: theme.spacing.s,
            }}>
            <Typography.Button2>{section}</Typography.Button2>
          </View>
        )}
      /> */}
    </DView>
  );
};

export default Operations;

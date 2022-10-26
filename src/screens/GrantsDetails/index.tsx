import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import PermissionComponent from 'screens/GrantsDetails/components/PermissionComponent';
import useStyles from './useStyles';

export type GrantsSection = {
  name: string;
  grants: any[];
};

export type GrantsDetailsParams = {
  checked: boolean;
  section: GrantsSection;
};

declare type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.GRANTS_DETAILS
>;

const GrantsDetails: React.FC<NavProps> = () => {
  const {t} = useTranslation('grantsDetails');
  const {params} = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();

  const title = useMemo(() => {
    switch (params.section.name) {
      case 'contents':
        return t('contents permission');
      case 'reactions':
        return t('reactions permission');
      case 'profile':
        return t('profile permission');
      case 'relationships':
        return t('relationships permission');
      case 'report':
        return t('report permission');
      case 'contracts':
        return t('contracts permission');
      default:
        return 'unmapped';
    }
  }, [params, t]);

  const permissionList = useMemo(() => {
    switch (params.section.name) {
      case 'contents':
        return [
          t('create post'),
          t('delete post'),
          t('edit post'),
          t('add comment'),
          t('delete comment'),
          t('edit comment'),
        ];
      case 'reactions':
        return [t('add reaction'), t('remove reaction')];
      case 'profile':
        return [t('edit profile')];
      case 'relationships':
        return [t('create relationship'), t('delete relationship')];
      case 'report':
        return [t('create report')];
      case 'contracts':
        return [t('send tip')];
      default:
        return [];
    }
  }, [params, t]);

  return (
    <DView
      style={styles.root}
      topBar={<TopBar />}
      disableHideKeyboardTouchable={true}>
      <Spacer paddingBottom={16}>
        <Typography.H3>{title}</Typography.H3>
      </Spacer>
      <Typography.Body5>
        {t('details description', {
          title,
        })}
      </Typography.Body5>
      <Spacer paddingBottom={theme.spacing.s} />
      <ScrollView style={styles.scrollView}>
        {permissionList.map(permissionName => {
          return (
            <PermissionComponent
              checked={params.checked}
              permissionName={permissionName}
              key={permissionName}
            />
          );
        })}
      </ScrollView>
    </DView>
  );
};

export default GrantsDetails;

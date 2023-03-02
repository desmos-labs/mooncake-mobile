import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { authorizationImage } from 'assets/images';
import Button, {ButtonMode} from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useAddOrUpdateGrants from 'hooks/authGrants/useAddOrUpdateGrants';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import PermissionComponent from 'screens/GrantsDetails/components/PermissionComponent';
import { useGetAuthzGrants } from 'services/graphql/queries/GetAuthGrants';
import useStyles from './useStyles';

export type GrantsSection = {
  name: string;
};

export type GrantsDetailsParams = {
  section: GrantsSection;
};

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_GRANTS_DETAILS>;

const GrantsDetails: React.FC<NavProps> = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('grantsDetails');
  const { params } = useRoute<NavProps['route']>();
  const { navigate, pop } = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const theme = useTheme();
  const { checkAndUpdateGrants } = useCheckAndUpdateGrants();
  const [grantsGiven, setGrantsGiven] = useState<GrantEnums[]>([]);
  const { getAuthzGrants } = useGetAuthzGrants();
  const { revokeGrants } = useAddOrUpdateGrants();

  const fetchGrants = useCallback(async () => {
    try {
      setInitialLoading(true);
      const { grants } = await getAuthzGrants();
      if (grants) {
        setGrantsGiven(
          grants.map(grant => {
            return grant.msg_type;
          }),
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setInitialLoading(false), 1000);
    }
  }, [getAuthzGrants]);

  useFocusEffect(
    useCallback(() => {
      fetchGrants();
    }, [fetchGrants]),
  );

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

  const permissionsLabelsList = useMemo(() => {
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

  const permissionsEnumList = useMemo(() => {
    switch (params.section.name) {
      case 'contents':
        return [GrantEnums.MsgCreatePost];
      case 'reactions':
        return [GrantEnums.MsgAddReaction, GrantEnums.MsgRemoveReaction];
      case 'profile':
        return [GrantEnums.MsgSaveProfile];
      case 'relationships':
        return [GrantEnums.MsgCreateRelationship, GrantEnums.MsgDeleteRelationship];
      case 'report':
        return [GrantEnums.MsgCreateReport];
      case 'contracts':
        return [GrantEnums.MsgExecuteContract];
      default:
        return [];
    }
  }, [params]);

  const permissionsGiven = useMemo(() => {
    return permissionsEnumList.every(given => grantsGiven.includes(given));
  }, [grantsGiven, permissionsEnumList]);

  const onPressGrant = useCallback(async () => {
    try {
      setLoading(true);
      const result = await checkAndUpdateGrants({
        grantsToRequest: permissionsEnumList,
        stayOnCurrentScreen: true,
        detailsModal: {
          title: t('grants:grant permissions'),
          body: t('grant following', {
            permissions: params.section.name.charAt(0).toUpperCase() + params.section.name.slice(1),
          }),
          buttonLabel: t('yes grant'),
        },
      });
      await fetchGrants();
      navigate(ROUTES.TEXTONLY_MODAL, {
        title: t('common:success'),
        bodyStyle: { textAlign: 'center' },
        body: t('grants:successful grant'),
        image: authorizationImage,
      });
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [checkAndUpdateGrants, fetchGrants, permissionsEnumList]);

  const revokePermissionsWrapper = useCallback(async () => {
    try {
      setLoading(true);
      await revokeGrants(permissionsEnumList);
      await fetchGrants();
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchGrants, permissionsEnumList, revokeGrants]);

  const onPressRevoke = useCallback(() => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('grants:revoke permissions'),
      subtitle: t('revoke following', {
        permissions: params.section.name.charAt(0).toUpperCase() + params.section.name.slice(1),
      }),
      primaryButtonLabel: t('yes revoke'),
      secondaryButtonLabel: t('cancel'),
      onPressPrimary: () => revokePermissionsWrapper(),
      onPressSecondary: () => pop(),
      removeModalAfterButtonPress: true,
    });
  }, [navigate, pop, revokePermissionsWrapper, t]);

  return (
    <DView style={styles.root} topBar={<TopBar />} disableHideKeyboardTouchable={true}>
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
        {permissionsLabelsList.map(permissionName => {
          return (
            <PermissionComponent
              checked={permissionsGiven}
              permissionName={permissionName}
              key={permissionName}
            />
          );
        })}
      </ScrollView>
      {!initialLoading ? (
        permissionsGiven ? (
          <Button
            loading={loading}
            mode={ButtonMode.OUTLINED}
            size={44}
            onPress={onPressRevoke}>
            {t('revoke permission')}
          </Button>
        ) : (
          <Button
            loading={loading}
            mode={ButtonMode.CONTAINED}
            size={44}
            textColor={theme.colors.white}
            backgroundColor={theme.colors.surfaceBlack}
            onPress={onPressGrant}>
            {t('grant permission')}
          </Button>
        )
      ) : (
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      )}
    </DView>
  );
};

export default GrantsDetails;

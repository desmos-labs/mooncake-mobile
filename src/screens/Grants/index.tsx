import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import GrantSection from 'screens/Grants/components/GrantSection';
import {useGetAuthzGrants} from 'services/graphql/queries/GetAuthGrants';
import useStyles from './useStyles';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.GRANTS>;

const Grants: React.FC<NavProps> = props => {
  const {
    navigation: {navigate},
  } = props;
  const {t} = useTranslation('grants');
  const styles = useStyles();
  const theme = useTheme();
  const {pop} = useNavigation<NavProps['navigation']>();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  /*
  const {revokeGrants} = useAddOrUpdateGrants();
*/
  const [loading, setLoading] = useState<boolean>(false);
  const [grantsGiven, setGrantsGiven] = useState<GrantEnums[]>([]);
  const {getAuthzGrants} = useGetAuthzGrants();

  const fetchGrants = useCallback(async () => {
    try {
      const {grants} = await getAuthzGrants();
      if (grants) {
        setGrantsGiven(
          grants.map(grant => {
            return grant.msg_type;
          }),
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, [getAuthzGrants]);

  const checkPermission = useCallback(
    (permission: GrantEnums) => {
      return grantsGiven.findIndex(grant => grant === permission) !== -1;
    },
    [grantsGiven],
  );

  const grantPermissionsWrapper = useCallback(async () => {
    try {
      await checkAndUpdateGrants({
        grantsToRequest: [
          GrantEnums.MsgCreatePost,
          GrantEnums.MsgAddReaction,
          GrantEnums.MsgRemoveReaction,
          GrantEnums.MsgCreateRelationship,
          GrantEnums.MsgDeleteRelationship,
          GrantEnums.MsgCreateReport,
          GrantEnums.MsgSaveProfile,
          GrantEnums.MsgExecuteContract,
        ],
        stayOnCurrentScreen: true,
      });
      await fetchGrants();
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [checkAndUpdateGrants, fetchGrants]);

  /*  const revokePermissionsWrapper = useCallback(async () => {
    try {
      setLoading(true);
      await revokeGrants();
      await fetchGrants();
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchGrants, revokeGrants]); */

  const grantAllPermissions = useCallback(async () => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('grant permissions'),
      subtitle: t('grant permissions desc'),
      subtitleStyle: {textAlign: 'left'},
      primaryButtonLabel: t('grant all permissions'),
      secondaryButtonLabel: t('common:cancel'),
      removeModalAfterButtonPress: true,
      onPressPrimary: () => grantPermissionsWrapper(),
      onPressSecondary: () => pop(),
    });
  }, [grantPermissionsWrapper, navigate, pop, t]);

  /*  const revokeAllPermissions = useCallback(async () => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('revoke permissions'),
      subtitle: t('revoke permissions desc'),
      primaryButtonLabel: t('revoke all permissions'),
      secondaryButtonLabel: t('common:cancel'),
      onPressPrimary: () => revokePermissionsWrapper(),
      onPressSecondary: () => pop(),
      removeModalAfterButtonPress: true,
    });
  }, [navigate, pop, revokePermissionsWrapper, t]); */

  useFocusEffect(
    useCallback(() => {
      fetchGrants();
    }, [fetchGrants]),
  );

  const navigateToSection = useCallback(async (section: {name: string}) => {
    navigate(ROUTES.GRANTS_DETAILS, {section});
  }, []);

  return (
    <DView
      style={styles.root}
      topBar={<TopBar />}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}>
      <Spacer paddingBottom={16}>
        <Typography.H3>{t('grant permissions')}</Typography.H3>
      </Spacer>
      <Typography.Body5>{t('description')}</Typography.Body5>
      <Spacer paddingBottom={theme.spacing.s} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.m,
          paddingVertical: theme.spacing.m,
        }}>
        <GrantSection
          title={t('contents')}
          description={t('contents desc')}
          onPress={() =>
            navigateToSection({
              name: 'contents',
            })
          }
          checked={checkPermission(GrantEnums.MsgCreatePost)}
        />
        <GrantSection
          title={t('reactions')}
          description={t('reactions desc')}
          onPress={() =>
            navigateToSection({
              name: 'reactions',
            })
          }
          checked={checkPermission(GrantEnums.MsgAddReaction)}
        />
        <GrantSection
          title={t('profile')}
          description={t('profile desc')}
          onPress={() =>
            navigateToSection({
              name: 'profile',
            })
          }
          checked={checkPermission(GrantEnums.MsgSaveProfile)}
        />
        <GrantSection
          title={t('relationships')}
          description={t('relationships desc')}
          onPress={() =>
            navigateToSection({
              name: 'relationships',
            })
          }
          checked={checkPermission(GrantEnums.MsgCreateRelationship)}
        />
        <GrantSection
          title={t('report')}
          description={t('report desc')}
          onPress={() =>
            navigateToSection({
              name: 'report',
            })
          }
          checked={checkPermission(GrantEnums.MsgCreateReport)}
        />
        <GrantSection
          title={t('contracts')}
          description={t('contracts desc')}
          onPress={() =>
            navigateToSection({
              name: 'contracts',
            })
          }
          checked={checkPermission(GrantEnums.MsgExecuteContract)}
        />
        <View>
          <Spacer paddingTop={theme.spacing.s} />
          <Button
            loading={loading}
            mode="contained"
            color={theme.colors.surfaceBlack}
            onPress={grantAllPermissions}
            style={{justifyContent: 'flex-end'}}>
            <Typography.Button2 style={{color: theme.colors.white}}>
              {t('grant all permissions')}
            </Typography.Button2>
          </Button>
        </View>
      </ScrollView>
    </DView>
  );
};

export default Grants;

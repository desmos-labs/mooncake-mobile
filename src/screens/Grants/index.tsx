import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {authorizationImage} from 'assets/images';
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
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingGrants, setFetchingGrants] = useState<boolean>(false);
  const [grantsGiven, setGrantsGiven] = useState<GrantEnums[]>([]);
  const {getAuthzGrants} = useGetAuthzGrants();

  const fetchGrants = useCallback(async () => {
    try {
      setFetchingGrants(true);
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
    } finally {
      setFetchingGrants(false);
    }
  }, [getAuthzGrants]);

  const checkPermission = useCallback(
    (permission: GrantEnums) => {
      return grantsGiven.findIndex(grant => grant === permission) !== -1;
    },
    [grantsGiven],
  );

  const grantAllPermissions = useCallback(async () => {
    try {
      setLoading(true);
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
        detailsModal: {
          title: t('grant permissions'),
          body: t('grant permissions desc'),
          bodyStyle: {textAlign: 'left'},
          buttonLabel: t('grant all permissions'),
        },
      });
      await fetchGrants();
      navigate(ROUTES.TEXTONLY_MODAL, {
        title: t('common:success'),
        bodyStyle: {textAlign: 'center'},
        body: t('successful grant'),
        image: authorizationImage,
      });
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [checkAndUpdateGrants, fetchGrants]);

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
      showLoadingOverlay={fetchingGrants || loading}
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
        {grantsGiven.length !== Object.keys(GrantEnums).length && (
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
        )}
      </ScrollView>
    </DView>
  );
};

export default Grants;

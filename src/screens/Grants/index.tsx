import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RefreshControl, ScrollView, View} from 'react-native';
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
  const [loading, setLoading] = useState(false);
  const [grantsGiven, setGrantsGiven] = useState<
    {
      msg_type: GrantEnums;
      expiration: string;
    }[]
  >([]);
  const {getAuthzGrants} = useGetAuthzGrants();

  const fetchGrants = useCallback(async () => {
    try {
      setLoading(true);
      const {grants} = await getAuthzGrants();
      if (grants) {
        setGrantsGiven(grants);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getAuthzGrants]);

  useFocusEffect(
    useCallback(() => {
      fetchGrants();
    }, [fetchGrants]),
  );

  const navigateToSection = useCallback(
    async (section: {name: string; grants: {}[]}) => {
      navigate(ROUTES.GRANTS_DETAILS, {section});
    },
    [],
  );

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
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchGrants} />
        }
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
              grants: grantsGiven,
            })
          }
          checked={
            grantsGiven.findIndex(
              grant => grant.msg_type === GrantEnums.MsgCreatePost,
            ) !== -1
          }
        />
        <GrantSection
          title={t('reactions')}
          description={t('reactions desc')}
          onPress={() =>
            navigateToSection({
              name: 'reactions',
              grants: grantsGiven,
            })
          }
          checked={
            grantsGiven.findIndex(
              grant =>
                grant.msg_type === GrantEnums.MsgAddReaction ||
                grant.msg_type === GrantEnums.MsgRemoveReaction,
            ) !== -1
          }
        />
        <GrantSection
          title={t('profile')}
          description={t('profile desc')}
          onPress={() =>
            navigateToSection({
              name: 'profile',
              grants: grantsGiven,
            })
          }
          checked={
            grantsGiven.findIndex(
              grant => grant.msg_type === GrantEnums.MsgSaveProfile,
            ) !== -1
          }
        />
        <GrantSection
          title={t('relationships')}
          description={t('relationships desc')}
          onPress={() =>
            navigateToSection({
              name: 'relationships',
              grants: grantsGiven,
            })
          }
          checked={
            grantsGiven.findIndex(
              grant =>
                grant.msg_type === GrantEnums.MsgCreateRelationship ||
                grant.msg_type === GrantEnums.MsgDeleteRelationship,
            ) !== -1
          }
        />
        <GrantSection
          title={t('report')}
          description={t('report desc')}
          onPress={() =>
            navigateToSection({
              name: 'report',
              grants: grantsGiven,
            })
          }
          checked={
            grantsGiven.findIndex(
              grant => grant.msg_type === GrantEnums.MsgCreateReport,
            ) !== -1
          }
        />
        <GrantSection
          title={t('contracts')}
          description={t('contracts desc')}
          onPress={() =>
            navigateToSection({
              name: 'contracts',
              grants: grantsGiven,
            })
          }
          checked={
            grantsGiven.findIndex(
              grant => grant.msg_type === GrantEnums.MsgExecuteContract,
            ) !== -1
          }
        />
        {grantsGiven.length !== 6 && (
          <View>
            <Spacer paddingTop={theme.spacing.s} />
            <Button
              mode="contained"
              color={theme.colors.surfaceBlack}
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

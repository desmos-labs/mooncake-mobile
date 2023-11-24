import { StackScreenProps } from '@react-navigation/stack';
import { invitesBanner2 } from 'assets/images';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import { HStack, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import InvitesList from 'screens/ManageInvites/components/InvitesList';
import useGetSectionedInvites from './hooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MANAGE_INVITES>;

const ManageInvites = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('invites');
  const { rewardBalance, claimedInvites, pendingInvites, maxInvitations, loading, refetch } =
    useGetSectionedInvites();

  return (
    <DView
      backgroundColor={theme.colors.backgroundGrey}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      topBar={<TopBar style={{ paddingBottom: theme.spacing.m }} />}>
      <HStack>
        <View style={styles.textContainer}>
          <Typography.H3>{t('invites')}</Typography.H3>
          <Spacer paddingTop={theme.spacing.s} />
          <Typography.Body5>{t('total rewards')}</Typography.Body5>
          <Spacer paddingTop={theme.spacing.s} />
          {rewardBalance !== undefined ? (
            <Typography.H1>{rewardBalance} DSM</Typography.H1>
          ) : (
            <StyledSpinner style={CommonStyles.flex[1]} />
          )}
        </View>
        <Image contentFit="cover" source={invitesBanner2} style={styles.banner} />
      </HStack>
      <InvitesList
        loading={loading}
        maxInvitations={maxInvitations}
        claimedInvites={claimedInvites}
        pendingInvites={pendingInvites}
        refetchInvites={refetch}
      />
    </DView>
  );
};

export default ManageInvites;

import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {invitesBanner2} from 'assets/images';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import InvitesList from 'screens/ManageInvites/components/InvitesList';
import useHooks from 'screens/ManageInvites/useHooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.MANAGE_INVITES
>;

const ManageInvites = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {rewardBalance, t} = useHooks();

  return (
    <DView
      backgroundColor={theme.colors.backgroundGrey}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      topBar={<TopBar style={{paddingBottom: theme.spacing.m}} />}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.textContainer}>
          <Typography.H3>{t('invites')}</Typography.H3>
          <Spacer paddingTop={theme.spacing.s} />
          <Typography.Body5>{t('total rewards')}</Typography.Body5>
          <Spacer paddingTop={theme.spacing.s} />
          {rewardBalance !== undefined ? (
            <Typography.H1>{rewardBalance} DSM</Typography.H1>
          ) : (
            <ActivityIndicator style={{flex: 1}} />
          )}
        </View>
        <FastImage
          resizeMode="cover"
          source={invitesBanner2}
          style={styles.banner}
        />
      </View>
      <InvitesList navigate={navigate} />
    </DView>
  );
};

export default ManageInvites;

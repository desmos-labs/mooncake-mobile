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
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import InvitesList from 'screens/ManageInvites/components/InvitesList';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.MANAGE_INVITES
>;

const ManageInvites = () => {
  const styles = useStyles();
  const {t} = useTranslation('invites');
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();

  return (
    <DView
      backgroundColor={theme.colors.backgroundGrey}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      topBar={<TopBar style={{paddingBottom: theme.spacing.m}} />}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'column', paddingLeft: theme.spacing.m}}>
          <Typography.H3>{t('invites')}</Typography.H3>
          <Spacer paddingTop={theme.spacing.s} />
          <Typography.Body5>{t('total rewards')}</Typography.Body5>
          <Spacer paddingTop={theme.spacing.s} />
          <Typography.H1>0 DSM</Typography.H1>
        </View>
        <FastImage
          resizeMode="cover"
          source={invitesBanner2}
          style={{
            width: 140,
            height: 240,
            right: 0,
            marginLeft: 'auto',
            top: -100,
          }}
        />
      </View>
      <InvitesList navigate={navigate} />
    </DView>
  );
};

export default ManageInvites;

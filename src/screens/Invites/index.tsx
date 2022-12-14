import {useQuery} from '@apollo/client';
import Clipboard from '@react-native-clipboard/clipboard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  copyIcon,
  infoIcon,
  invite1,
  invite2,
  invite3,
  invite4,
  invitesBanner,
  inviteUserIcon,
} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import ToastConfig from 'config/ToastConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import StepComponent from 'screens/Invites/components/StepComponent';
import GenerateInvite from 'services/axios/requests/GenerateInvite';
import GetInvites from 'services/graphql/queries/GetInvites';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.INVITES>;

const Invites = () => {
  const {activeAddress} = useActiveAccount();
  const [inviteGenerated, setInviteGenerated] = useState<boolean>();
  const [generationLoading, setGenerationLoading] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const styles = useStyles();
  const {t} = useTranslation('invites');
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const toast = useToast();
  const {data, refetch} = useQuery(GetInvites, {
    fetchPolicy: 'no-cache',
  });

  const numInvitesGenerated = useMemo(() => {
    if (!data) {
      return undefined;
    } else {
      return data.invite.filter(
        (invite: any) => invite?.claimer_address !== activeAddress,
      ).length;
    }
  }, [data, activeAddress]);

  const rightElement = useMemo(() => {
    return (
      <TouchableOpacity onPress={() => navigate(ROUTES.MANAGE_INVITES)}>
        <Typography.Button2>{t('invites')}</Typography.Button2>
      </TouchableOpacity>
    );
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: inviteLink,
        title: 'Butter invitation link',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [generationLoading]),
  );

  const generateInvite = useCallback(async () => {
    try {
      setGenerationLoading(true);
      const response = await GenerateInvite();
      if (response.link) {
        console.log(response);
        setInviteLink(response.link);
        setInviteGenerated(true);
      }
    } catch (e) {
      toast.show('Max amount of invites already reached', {
        type: ToastConfig.ERROR_NO_RETRY,
      });
      setInviteGenerated(false);
    } finally {
      setGenerationLoading(false);
    }
  }, [inviteLink, inviteGenerated]);

  const shareComponent = useMemo(() => {
    return (
      <View style={{marginHorizontal: theme.spacing.m}}>
        <View style={styles.inviteContainer}>
          <Typography.Body6 selectable={true} style={styles.inviteText}>
            {inviteLink}
          </Typography.Body6>
          <TouchableOpacity
            onPress={() => Clipboard.setString(inviteLink)}
            style={styles.copyButton}>
            <Image source={copyIcon} style={styles.copyIcon} />
          </TouchableOpacity>
        </View>
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={onShare}>
          {t('share')}
        </Button>
      </View>
    );
  }, [inviteLink]);

  return (
    <DView
      backgroundColor={theme.colors.background}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      scrollable={true}
      topBar={
        <TopBar
          rightElement={rightElement}
          style={{paddingBottom: theme.spacing.m}}
        />
      }>
      <FastImage
        resizeMode="cover"
        source={invitesBanner}
        style={styles.banner}
      />

      <View style={styles.subtitleContainer}>
        <Typography.H3>{t('invite friends')}</Typography.H3>
        <Typography.Body6>{t('refer a friend')}</Typography.Body6>
        <Spacer paddingVertical={theme.spacing.s} />
      </View>
      {inviteGenerated ? (
        shareComponent
      ) : (
        <Button
          disabled={numInvitesGenerated === 3}
          onPress={generateInvite}
          loading={generationLoading}
          color={theme.colors.surfaceBlack}
          style={{marginHorizontal: theme.spacing.m}}
          mode="contained">
          {t('generate invite')}
        </Button>
      )}
      <Spacer paddingVertical={theme.spacing.m} />
      <View style={{alignItems: 'center'}}>
        <View style={styles.rowCenter}>
          <Typography.Subtitle2>
            {t('points', {number: 0})}
          </Typography.Subtitle2>
          <Typography.Body5> {t('requried')}</Typography.Body5>
          <ImageButton
            onPress={() => navigate(ROUTES.IMPACT_POINTS_MODAL)}
            image={infoIcon}
            style={styles.iconLeft}
          />
        </View>
        <Spacer paddingTop={6} />
        <View style={styles.rowCenter}>
          <Image source={inviteUserIcon} style={styles.iconRight} />
          {numInvitesGenerated ? (
            <Typography.Body6 style={{color: theme.colors.midGrey}}>
              {t('invites shared', {number: numInvitesGenerated})}
            </Typography.Body6>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </View>
      <Spacer paddingVertical={16} />
      <View style={{paddingHorizontal: theme.spacing.m}}>
        <Typography.Subtitle2>{t('invite steps')}</Typography.Subtitle2>
        <View style={{padding: theme.spacing.m}}>
          <StepComponent
            image={invite1}
            number={1}
            text={t('generate invite')}
          />

          <StepComponent image={invite2} number={2} text={t('share invite')} />
          <StepComponent image={invite3} number={3} text={t('wait redeem')} />
          <StepComponent
            image={invite4}
            number={4}
            text={t('get rewards')}
            disableLine={true}
          />
        </View>
      </View>
    </DView>
  );
};

export default Invites;

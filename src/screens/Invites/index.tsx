import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
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
import Button, { ButtonMode } from 'components/Button';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Share, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import StepComponent from 'screens/Invites/components/StepComponent';
import { useGenerateInvite, useGetActiveAccountInvitesInfo } from 'screens/Invites/hooks';
import ToastConfig from 'config/ToastConfig';
import { ResultAsync } from 'neverthrow';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_INVITES>;

const Invites = () => {
  const [generatingInvite, setGeneratingInvite] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string | undefined>();
  const styles = useStyles();
  const { t } = useTranslation('invites');
  const theme = useTheme();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const toast = useToast();
  const generateInvite = useGenerateInvite();
  const { refetch, invitesInfo } = useGetActiveAccountInvitesInfo();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const rightElement = useMemo(() => {
    return (
      <TouchableOpacity onPress={() => navigate(ROUTES.MANAGE_INVITES)}>
        <Typography.Button2>{t('invites')}</Typography.Button2>
      </TouchableOpacity>
    );
  }, [navigate, t]);

  const onShare = React.useCallback(async () => {
    if (inviteLink !== undefined) {
      const shareResult = await ResultAsync.fromPromise(
        Share.share({
          message: inviteLink,
          title: 'Butter invitation link',
        }),
        e =>
          Error((e as Partial<Error> | undefined)?.message ?? 'Error performing the share action'),
      );

      if (shareResult.isOk()) {
        if (shareResult.value.action === Share.sharedAction) {
          if (shareResult.value.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (shareResult.value.action === Share.dismissedAction) {
          // dismissed
        }
      } else {
        toast.show(shareResult.error.message, {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    }
  }, [inviteLink, toast]);

  const handleGenerateInvitePress = React.useCallback(async () => {
    setGeneratingInvite(true);
    const generateInviteResult = await generateInvite();
    if (generateInviteResult.isOk()) {
      setInviteLink(generateInviteResult.value);
    } else {
      toast.show(generateInviteResult.error.message, {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    }
    setGeneratingInvite(false);
  }, [generateInvite, toast]);

  return (
    <DView
      backgroundColor={theme.colors.background}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      scrollable={true}
      topBar={<TopBar rightElement={rightElement} style={{ paddingBottom: theme.spacing.m }} />}>
      <FastImage resizeMode="cover" source={invitesBanner} style={styles.banner} />

      <View style={styles.subtitleContainer}>
        <Typography.H3>{t('invite friends')}</Typography.H3>
        <Typography.Body6>{t('refer a friend')}</Typography.Body6>
        <Spacer paddingVertical={theme.spacing.s} />
      </View>

      {inviteLink === undefined ? (
        /* Component to generate a new invitation link */
        <Button
          disabled={
            invitesInfo === undefined ||
            invitesInfo.generatedInvites === invitesInfo.generableInvitesCount ||
            invitesInfo.requiredImpactPoints > invitesInfo.userImpactPoints ||
            generatingInvite
          }
          onPress={handleGenerateInvitePress}
          size={44}
          textColor={theme.colors.white}
          backgroundColor={theme.colors.surfaceBlack}
          additionalStyle={{ marginHorizontal: theme.spacing.m }}
          mode={ButtonMode.CONTAINED}>
          {t('generate invite')}
        </Button>
      ) : (
        /* Component to share the invitation link */
        <View style={{ marginHorizontal: theme.spacing.m }}>
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
          <Button mode="contained" color={theme.colors.surfaceBlack} onPress={onShare}>
            {t('share')}
          </Button>
        </View>
      )}

      <Spacer paddingVertical={theme.spacing.m} />

      <View style={{ alignItems: 'center' }}>
        {/* Shows the required impact points to generate an invitation link */}
        {(invitesInfo === undefined ||
          invitesInfo.generatedInvites < invitesInfo.generableInvitesCount) && (
          <View style={styles.rowCenter}>
            {invitesInfo !== undefined ? (
              <Typography.Subtitle2>
                {t('points', { number: invitesInfo.requiredImpactPoints })}
              </Typography.Subtitle2>
            ) : (
              <ActivityIndicator color={theme.colors.surfaceBlack} />
            )}
            <Typography.Body5> {t('required')}</Typography.Body5>
            <ImageButton
              onPress={() => navigate(ROUTES.IMPACT_POINTS_MODAL)}
              image={infoIcon}
              style={styles.iconLeft}
            />
          </View>
        )}

        <Spacer paddingTop={6} />

        {/* Shows the number of generated invitation links */}
        <View style={styles.rowCenter}>
          <Image source={inviteUserIcon} style={styles.iconRight} />
          {invitesInfo !== undefined ? (
            <Typography.Body6 style={{ color: theme.colors.midGrey }}>
              {t('invites shared', {
                number: invitesInfo.generatedInvites,
                total: invitesInfo.generableInvitesCount,
              })}
            </Typography.Body6>
          ) : (
            <ActivityIndicator color={theme.colors.surfaceBlack} />
          )}
        </View>
      </View>

      <Spacer paddingVertical={16} />
      <View style={{ paddingHorizontal: theme.spacing.m }}>
        <Typography.Subtitle2>{t('invite steps')}</Typography.Subtitle2>
        <View style={{ padding: theme.spacing.m }}>
          <StepComponent image={invite1} number={1} text={t('generate invite')} />

          <StepComponent image={invite2} number={2} text={t('share invite')} />
          <StepComponent image={invite3} number={3} text={t('wait redeem')} />
          <StepComponent image={invite4} number={4} text={t('get rewards')} disableLine={true} />
        </View>
      </View>
    </DView>
  );
};

export default Invites;

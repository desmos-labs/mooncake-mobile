import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { copyIcon, invite1, invite2, invite3, invite4, invitesBanner } from 'assets/images';
import Button, { ButtonMode, ButtonSize } from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Share, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'native-base';
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
  const { refetch } = useGetActiveAccountInvitesInfo();

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
          onPress={handleGenerateInvitePress}
          size={44}
          textColor={theme.colors.white}
          backgroundColor={theme.colors.surfaceBlack}
          additionalStyle={{ marginHorizontal: theme.spacing.m }}
          loading={generatingInvite}
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
          <Button
            mode={ButtonMode.CONTAINED}
            backgroundColor={theme.colors.surfaceBlack}
            size={ButtonSize.M}
            textColor={theme.colors.white}
            onPress={onShare}>
            {t('share')}
          </Button>
        </View>
      )}

      <Spacer paddingVertical={theme.spacing.s} />

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

import { emptyInvitesImage } from 'assets/images';
import Button from 'components/CustomButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
  SafeAreaView,
  SectionList,
  SectionListData,
  View,
} from 'react-native';
import { useTheme } from 'native-base';
import InviteComponent from 'screens/ManageInvites/components/InviteComponent';
import { Invite } from 'types/invites';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NavProps } from 'screens/ManageInvites';
import useStyles from './useStyles';

interface Props {
  loading: boolean;
  pendingInvites: Invite[];
  claimedInvites: Invite[];
  maxInvitations: number;
  refetchInvites: () => any;
}

const InvitesList = ({
  loading,
  pendingInvites,
  claimedInvites,
  maxInvitations,
  refetchInvites,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('invites');
  const { navigate } = useNavigation<NavProps['navigation']>();

  const totalInvites = React.useMemo(() => {
    return pendingInvites.length + claimedInvites.length;
  }, [pendingInvites, claimedInvites]);

  const renderInvite = React.useCallback(({ item, index }: ListRenderItemInfo<Invite>) => {
    return <InviteComponent invite={item} index={index + 1} />;
  }, []);

  const EmptyInvites = useMemo(() => {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Image source={emptyInvitesImage} style={styles.emptyImage} />
          <Typography.Body5>{t('no invites yet')}</Typography.Body5>
        </View>

        <Spacer paddingVertical="l" />

        <Button
          size={44}
          textColor={theme.colors.white}
          backgroundColor={theme.colors.surfaceBlack}
          onPress={() => navigate(ROUTES.SETTINGS_INVITES)}>
          {t('invite friends now')}
        </Button>
      </View>
    );
  }, [
    navigate,
    styles.container,
    styles.emptyImage,
    t,
    theme.colors.surfaceBlack,
    theme.colors.white,
  ]);

  const inviteSections = React.useMemo(() => {
    const sections: SectionListData<Invite>[] = [];
    if (loading) {
      return sections;
    }

    if (pendingInvites.length > 0) {
      sections.push({ section: t('pending invites'), data: pendingInvites });
    }
    if (claimedInvites.length > 0) {
      sections.push({ section: t('successful invites'), data: claimedInvites });
    }

    return sections;
  }, [claimedInvites, loading, pendingInvites, t]);

  const bottomComponent = useMemo(() => {
    return totalInvites >= maxInvitations ? (
      <Typography.Body6
        style={{
          color: theme.colors.grey01,
          alignSelf: 'center',
          textAlign: 'center',
          marginTop: theme.spacing.m,
        }}>
        {t('sent all')}
      </Typography.Body6>
    ) : (
      <Button
        onPress={() => navigate(ROUTES.SETTINGS_INVITES)}
        size={44}
        textColor={theme.colors.white}
        backgroundColor={theme.colors.surfaceBlack}
        mx="m">
        {t('invite more')}
      </Button>
    );
  }, [
    maxInvitations,
    navigate,
    t,
    theme.colors.grey01,
    theme.colors.surfaceBlack,
    theme.colors.white,
    theme.spacing.m,
    totalInvites,
  ]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </SafeAreaView>
      ) : (
        <>
          <SectionList
            keyExtractor={(item, index) => item.code.toString() + index}
            refreshing={loading}
            onRefresh={refetchInvites}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: theme.spacing.m,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyInvites}
            sections={inviteSections}
            renderItem={renderInvite}
            renderSectionHeader={({ section: { section } }) => (
              <View style={styles.header}>
                <Typography.Button2>{section}</Typography.Button2>
              </View>
            )}
          />
          {totalInvites !== 0 && bottomComponent}
        </>
      )}
    </View>
  );
};

export default InvitesList;

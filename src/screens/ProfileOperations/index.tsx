import { Bank, Posts, Profiles, Reactions, Relationships, Reports } from '@desmoslabs/desmjs';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import {
  addReactionTxIcon,
  createPostTxIcon,
  editProfileTxIcon,
  emptyListPlaceholder,
  sendReportTxIcon,
  tipTxIcon,
} from 'assets/images';
import DView from 'components/DView';
import OperationContentLoader from 'components/Loaders/OperationContentLoader';
import TextRowContentLoader from 'components/Loaders/TextRowContentLoader';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import useAccountBalance from 'hooks/balance/useAccountBalance';
import useBalanceFiatAmount from 'hooks/balance/useBalanceFiatAmount';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { formatCoins, formatCurrencyAmount } from 'lib/FormatUtils';
import { Center, Divider, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItemInfo, SafeAreaView, SectionList, SectionListData, View } from 'react-native';
import { PastTransactionMessage } from 'types/transactions';
import MessageListItem from './components/MessageListItem';
import useHooks from './useHooks';
import useStyles from './useStyles';

export interface ProfileOperationsParams {
  /**
   * Address of the user for which to display the past activities.
   */
  userAddress: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_OPERATIONS>;

/**
 * Screen that allows to display the pat activities (tx) made from a given user.
 * @constructor
 */
const ProfileOperations = () => {
  const { t } = useTranslation('operations');
  const theme = useTheme();
  const styles = useStyles();

  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    balance,
    refetch: refreshBalance,
    loading: balanceLoading,
  } = useAccountBalance(userAddress);
  const { symbol, amount: fiatAmount, refetch: refreshFiatAmount } = useBalanceFiatAmount(balance);
  const { usePastActionsSections } = useHooks();

  const {
    sections,
    loading: isDataLoading,
    fetchMore,
    fetchingMore,
    refetch: refreshActions,
    refreshing,
  } = usePastActionsSections(userAddress);

  const formatDate = useFormatTimeForPostDetails();

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    refreshBalance();
    refreshFiatAmount();
    refreshActions();

    // It's fine to disable the exhaustive-deps warning on the next line as we want to run this effect only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Utility methods
  // -------------------------------------------------------------------------------------

  const getImage = useCallback((messageType: string) => {
    const formattedMessage = `/${messageType}`;
    switch (formattedMessage) {
      case Posts.v3.MsgCreatePostTypeUrl:
        return createPostTxIcon;
      case Relationships.v1.MsgCreateRelationshipTypeUrl:
        return editProfileTxIcon;
      case Relationships.v1.MsgDeleteRelationshipTypeUrl:
        return editProfileTxIcon;
      case Relationships.v1.MsgBlockUserTypeUrl:
        return editProfileTxIcon;
      case Relationships.v1.MsgUnblockUserTypeUrl:
        return editProfileTxIcon;
      case Reactions.v1.MsgAddReactionTypeUrl:
        return addReactionTxIcon;
      case Reactions.v1.MsgRemoveReactionTypeUrl:
        return addReactionTxIcon;
      case Profiles.v3.MsgDeleteProfileTypeUrl:
      case Profiles.v3.MsgSaveProfileTypeUrl:
        return editProfileTxIcon;
      case Reports.v1.MsgCreateReportTypeUrl:
        return sendReportTxIcon;
      case Bank.v1beta1.MsgSendTypeUrl:
        return tipTxIcon;
      default:
        console.warn(`No image found for message type ${formattedMessage}`);
        return undefined;
    }
  }, []);

  const getTitle = useCallback(
    (message: PastTransactionMessage) => {
      const formattedMessage = `/${message.type}`;
      switch (formattedMessage) {
        case Posts.v3.MsgCreatePostTypeUrl:
          return t('create comment post');
        case Relationships.v1.MsgCreateRelationshipTypeUrl:
          return t('follow user');
        case Relationships.v1.MsgDeleteRelationshipTypeUrl:
          return t('unfollow user');
        case Relationships.v1.MsgBlockUserTypeUrl:
          return t('block user');
        case Relationships.v1.MsgUnblockUserTypeUrl:
          return t('unblock user');
        case Reactions.v1.MsgAddReactionTypeUrl:
          return t('add reaction');
        case Reactions.v1.MsgRemoveReactionTypeUrl:
          return t('remove reaction');
        case Profiles.v3.MsgSaveProfileTypeUrl:
          return t('edit profile');
        case Profiles.v3.MsgDeleteProfileTypeUrl:
          return t('delete profile');
        case Reports.v1.MsgCreateReportTypeUrl:
          return t('create report');
        case Bank.v1beta1.MsgSendTypeUrl:
          console.log('message.senderAddress', message.senderAddress, userAddress);
          if (message.senderAddress === userAddress) {
            return t('send tip');
          } else {
            return t('receive tip');
          }
        default:
          console.warn(`No title found for message type ${formattedMessage}`);
          return '';
      }
    },
    [t, userAddress],
  );

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const keyExtractor = useCallback((item: PastTransactionMessage, index: number) => {
    return String(`messageKey${index}-${item.timestamp}`);
  }, []);

  const renderSectionHeader = useCallback(
    (info: { section: SectionListData<PastTransactionMessage> }) => {
      const header = formatDate(info.section.title, true);
      return (
        <>
          {sections.findIndex(item => item === info.section) !== 0 && (
            <Divider style={styles.divider} />
          )}
          <View style={styles.sectionHeader}>
            <Typography.Button2>{header}</Typography.Button2>
          </View>
        </>
      );
    },
    [formatDate, sections, styles.divider, styles.sectionHeader],
  );

  // Callback used to render the items of the list
  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PastTransactionMessage>) => {
      const hideFees = item.senderAddress !== undefined && item.senderAddress !== userAddress;
      return (
        <MessageListItem
          timestamp={item.timestamp}
          fees={item.fees}
          title={getTitle(item)}
          image={getImage(item.type)}
          hideFees={hideFees}
        />
      );
    },
    [getImage, getTitle, userAddress],
  );

  // Component used to render an empty list
  const EmptyOperations = useMemo(() => {
    if (isDataLoading) {
      return undefined;
    }

    return (
      <Center flex={1}>
        <Image contentFit="contain" source={emptyListPlaceholder} style={styles.emptyIcon} />
        <Typography.Body5>{t('no operations')}</Typography.Body5>
      </Center>
    );
  }, [isDataLoading, styles.emptyIcon, t]);

  // Component displayed at the bottom of the list
  const FooterComponent = useMemo(() => {
    if (!fetchingMore) {
      return undefined;
    }

    return (
      <Center my="s">
        <StyledSpinner />
      </Center>
    );
  }, [fetchingMore]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (isDataLoading || balanceLoading) {
    return (
      <SafeAreaView style={styles.flexCenter}>
        <StyledSpinner />
      </SafeAreaView>
    );
  }

  return (
    <DView
      topBar={<TopBar />}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      style={styles.container}>
      {/* Balance section title */}
      <View>
        <Spacer paddingTop="s" />
        <Typography.Body5>{t('balance')}</Typography.Body5>
        {/* Balance amount (in coins) */}
        {/* TODO: Show something if the balance is still loading */}
        <Typography.H2>{formatCoins(balance, ', ')}</Typography.H2>
        {/* Balance amount (in fiat) */}
        {/* TODO: Show something if the balance is still loading */}
        <Typography.H3>
          {symbol}
          {formatCurrencyAmount(fiatAmount)}
        </Typography.H3>
        <Spacer paddingVertical={theme.spacing.m} />
        {/* Past operations section title */}
        <Typography.H5 style={styles.subtitle}>{t('operations')}</Typography.H5>
        {/* Loading indicator */}
        {isDataLoading && (
          <View style={{ marginVertical: theme.spacing.m }}>
            <TextRowContentLoader width="120" />
            <Spacer paddingVertical={theme.spacing.s} />
            <OperationContentLoader />
          </View>
        )}
      </View>
      {/* Messages list TODO: move to Flashlist */}
      {!isDataLoading && (
        <SectionList
          style={CommonStyles.flex[1]}
          contentContainerStyle={CommonStyles.flexGrow[1]}
          refreshing={refreshing}
          onRefresh={refreshActions}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          sections={sections}
          renderItem={renderItem}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={31}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={EmptyOperations}
          ListFooterComponent={FooterComponent}
          onEndReached={fetchMore}
        />
      )}
    </DView>
  );
};

export default ProfileOperations;

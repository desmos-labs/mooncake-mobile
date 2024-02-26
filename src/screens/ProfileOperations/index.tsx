import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useRoute, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useActiveProfile } from '@recoil/profiles';
import { emptyListPlaceholder } from 'assets/images';
import AvatarImage from 'components/AvatarImage';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import TopBar from 'components/TopBar';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import useAccountBalance from 'hooks/balance/useAccountBalance';
import useBalanceFiatAmount from 'hooks/balance/useBalanceFiatAmount';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { formatCoins, formatCurrencyAmount } from 'lib/FormatUtils';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItemInfo, SectionList, SectionListData, View } from 'react-native';
import { PastTransactionMessage } from 'types/transactions';
import MessageListItem from './components/MessageListItem';
import { useGetOperationImage, useGetOperationTitle, usePastActionsSections } from './useHooks';
import useStyles from './useStyles';

export interface ProfileOperationsParams {
  /**
   * Address of the user for which to display the past operations.
   */
  userAddress: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_OPERATIONS>;

/**
 * Screen that allows to display the pat operations that are related to a given user.
 * @constructor
 */
const ProfileOperations = () => {
  const { t } = useTranslation('operations');
  const theme = useTheme();
  const styles = useStyles();

  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;
  const activeProfile = useActiveProfile();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    balance,
    refetch: refreshBalance,
    loading: balanceLoading,
  } = useAccountBalance(userAddress);
  const { symbol, amount: fiatAmount, refetch: refreshFiatAmount } = useBalanceFiatAmount(balance);

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

  const getImage = useGetOperationImage();
  const getTitle = useGetOperationTitle(userAddress);

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
        <View style={styles.sectionHeader}>
          <Typography.Semibold14>{header}</Typography.Semibold14>
        </View>
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
    if (balanceLoading || isDataLoading) {
      return undefined;
    }

    return (
      <View style={[CommonStyles.flex['1'], CommonStyles.center]}>
        <Image contentFit="contain" source={emptyListPlaceholder} style={styles.emptyIcon} />
        <Typography.Regular14>{t('no transactions')}</Typography.Regular14>
      </View>
    );
  }, [balanceLoading, isDataLoading, styles.emptyIcon, t]);

  // Component displayed at the bottom of the list
  const FooterComponent = useMemo(() => {
    if (!fetchingMore) {
      return undefined;
    }

    return (
      <View style={[CommonStyles.flex['1'], CommonStyles.center]}>
        <Spacer paddingVertical="s">
          <StyledSpinner />
        </Spacer>
      </View>
    );
  }, [fetchingMore]);

  const CenterElement = useMemo(() => {
    return (
      <View style={styles.centerElement}>
        <AvatarImage imageSource={activeProfile} size={28} />
        <Typography.Semibold16>{getProfileDisplayName(activeProfile!)}</Typography.Semibold16>
      </View>
    );
  }, [activeProfile]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      topBar={<TopBar centerElement={CenterElement} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}>
      {/* Balance section title */}
      <LinearGradient style={styles.gradient} colors={['#fed792', 'rgba(254, 215, 146, 0)']} />
      <View>
        <View style={styles.addressView}>
          <View style={styles.address}>
            <Typography.Regular14 numberOfLines={1}>{activeProfile?.address}</Typography.Regular14>
          </View>
        </View>
        <View style={styles.balanceView}>
          <Typography.Regular14>{t('total balance')}</Typography.Regular14>
          {balanceLoading ? (
            <View style={styles.flexCenter}>
              <StyledSpinner />
            </View>
          ) : (
            <Typography.Semibold30>
              {symbol}
              {formatCurrencyAmount(fiatAmount)}
            </Typography.Semibold30>
          )}
          <Typography.Regular14 style={styles.balanceSubtitle}>
            {formatCoins(balance, ', ')}
          </Typography.Regular14>
        </View>
        <Spacer paddingVertical={theme.spacings.m} />
        {/* Past operations section title */}
        <Typography.Semibold16 style={styles.subtitle}>{t('transactions')}</Typography.Semibold16>
        {/* Loading indicator */}
      </View>
      {/* Messages list TODO: move to Flashlist */}
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
    </DView>
  );
};

export default ProfileOperations;

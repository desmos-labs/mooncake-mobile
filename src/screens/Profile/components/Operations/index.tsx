import {
  convertCoin,
  MsgAddReactionTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgSaveProfileTypeUrl,
} from '@desmoslabs/desmjs';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import {
  addReactionTxIcon,
  createPostTxIcon,
  defaultProfilePic,
  editProfileTxIcon,
  emptyPostsIcon,
  sendReportTxIcon,
} from 'assets/images';
import DView from 'components/DView';
import OperationContentLoader from 'components/Loaders/OperationContentLoader';
import TextRowContentLoader from 'components/Loaders/TextRowContentLoader';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ListRenderItemInfo, SectionList, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import TxComponent from 'screens/Profile/components/Operations/components/TxComponent';
import useHooks from './useHooks';
import useStyles from './useStyles';

export interface OperationsParams {
  address: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_OPERATIONS>;

const Operations = () => {
  const { t } = useTranslation('operations');
  const theme = useTheme();
  const styles = useStyles();
  const { params } = useRoute<NavProps['route']>();
  const {
    convertedBalance,
    operationsData,
    pastActionsData,
    currentChain,
    fetchMore,
    operationsDataLoading,
    refetch,
    refetching,
    fetchingMore,
  } = useHooks(params.address);

  const titleMap: { [index: string]: string } = {
    [MsgCreatePostTypeUrl]: t('create comment post'),
    [MsgCreateRelationshipTypeUrl]: t('follow user'),
    [MsgDeleteRelationshipTypeUrl]: t('unfollow user'),
    [MsgAddReactionTypeUrl]: t('add reaction'),
    [MsgRemoveReactionTypeUrl]: t('remove reaction'),
    [MsgSaveProfileTypeUrl]: t('edit profile'),
    [MsgCreateReportTypeUrl]: t('create report'),
  };

  const imageMap: { [index: string]: Source } = {
    [MsgCreatePostTypeUrl]: createPostTxIcon,
    [MsgCreateRelationshipTypeUrl]: editProfileTxIcon,
    [MsgDeleteRelationshipTypeUrl]: editProfileTxIcon,
    [MsgAddReactionTypeUrl]: addReactionTxIcon,
    [MsgRemoveReactionTypeUrl]: addReactionTxIcon,
    [MsgSaveProfileTypeUrl]: editProfileTxIcon,
    [MsgCreateReportTypeUrl]: sendReportTxIcon,
  };

  const EmptyOperations = useMemo(() => {
    return operationsDataLoading ? null : (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage resizeMode="contain" source={emptyPostsIcon} style={styles.emptyIcon} />
        <Typography.Body5>{t('no operations')}</Typography.Body5>
      </View>
    );
  }, [t, operationsDataLoading]);

  const renderTx = React.useCallback(
    ({ item }: ListRenderItemInfo<any>) => {
      const fees = convertCoin(item.fees[0], 6, currentChain.currencies);
      return (
        <TxComponent
          timestamp={item.timestamp}
          fees={parseFloat(fees?.amount || '0').toFixed(4)}
          title={titleMap[`/${item.type}`] || 'Not mapped'}
          image={imageMap[`/${item.type}`] || defaultProfilePic}
          chain={currentChain}
        />
      );
    },
    [currentChain, titleMap, imageMap],
  );

  const footerComponent = useMemo(() => {
    if (fetchingMore) {
      return (
        <View style={{ padding: theme.spacing.m }}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      );
    } else {
      return null;
    }
  }, [fetchingMore]);

  return (
    <DView
      topBar={<TopBar />}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      style={styles.container}>
      <Typography.Body5>
        {convertedBalance?.balance?.denom.toUpperCase()} {t('balance')}
      </Typography.Body5>
      <Typography.H2>
        {convertedBalance?.balance?.amount} {convertedBalance?.balance?.denom.toUpperCase()}
      </Typography.H2>
      <Spacer paddingVertical={theme.spacing.s} />
      <Typography.H5>{t('operations')}</Typography.H5>
      {pastActionsData?.messages_by_address?.length >= 0 && !operationsDataLoading ? (
        <SectionList
          refreshing={refetching}
          onRefresh={refetch}
          keyExtractor={(item, index) => String(`operationKey${index + item.timestamp}`)}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyOperations}
          sections={operationsData}
          renderItem={renderTx}
          ListFooterComponent={footerComponent}
          onEndReached={({ distanceFromEnd }) => fetchMore(distanceFromEnd)}
          onEndReachedThreshold={0.5}
          renderSectionHeader={({ section: { section } }) => (
            <View style={styles.sectionHeader}>
              <Typography.Button2>{section}</Typography.Button2>
            </View>
          )}
        />
      ) : (
        <View style={{ marginVertical: theme.spacing.m }}>
          <TextRowContentLoader width="120" />
          <Spacer paddingVertical={theme.spacing.s} />
          <OperationContentLoader />
        </View>
      )}
    </DView>
  );
};

export default Operations;

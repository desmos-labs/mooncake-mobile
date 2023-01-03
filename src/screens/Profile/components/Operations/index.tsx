import {
  convertCoin,
  MsgAddReactionTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgSaveProfileTypeUrl,
} from '@desmoslabs/desmjs';
import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  addReactionTxIcon,
  createPostTxIcon,
  defaultProfilePic,
  editProfileTxIcon,
  emptyPostsIcon,
} from 'assets/images';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  ListRenderItemInfo,
  SectionList,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import TxComponent from 'screens/Profile/components/Operations/components/TxComponent';
import useHooks from './useHooks';
import useStyles from './useStyles';

export interface OperationsParams {
  address: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.OPERATIONS>;

const Operations = () => {
  const {t} = useTranslation('operations');
  const theme = useTheme();
  const styles = useStyles();
  const {params} = useRoute<NavProps['route']>();
  const {
    convertedBalance,
    operationsData,
    pastActionsData,
    currentChain,
    operationsDataFetchMore,
    operationsDataLoading,
    operationsDataRefetch,
  } = useHooks(params.address);

  const getCorrectTitle = useCallback((msgType: string) => {
    switch (msgType) {
      case MsgCreatePostTypeUrl:
        return t('create comment post');
      case MsgCreateRelationshipTypeUrl:
        return t('follow user');
      case MsgDeleteRelationshipTypeUrl:
        return t('unfollow user');
      case MsgAddReactionTypeUrl:
        return t('add reaction');
      case MsgRemoveReactionTypeUrl:
        return t('remove reaction');
      case MsgSaveProfileTypeUrl:
        return t('edit profile');
      default:
        return 'Not mapped';
    }
  }, []);

  const getCorrectImage = useCallback((msgType: string) => {
    switch (msgType) {
      case MsgCreatePostTypeUrl:
        return createPostTxIcon;
      case MsgCreateRelationshipTypeUrl:
      case MsgDeleteRelationshipTypeUrl:
        return editProfileTxIcon;
      case MsgAddReactionTypeUrl:
      case MsgRemoveReactionTypeUrl:
        return addReactionTxIcon;
      case MsgSaveProfileTypeUrl:
        return editProfileTxIcon;
      default:
        return defaultProfilePic;
    }
  }, []);

  const EmptyOperations = useMemo(() => {
    return operationsDataLoading ? null : (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage
          resizeMode="contain"
          source={emptyPostsIcon}
          style={styles.emptyIcon}
        />
        <Typography.Body5>{t('no operations')}</Typography.Body5>
      </View>
    );
  }, [t, operationsDataLoading]);

  const renderTx = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
      const title = getCorrectTitle(`/${item.type}`);
      const image = getCorrectImage(`/${item.type}`);
      const fees = convertCoin(item.fees[0], 6, currentChain.currencies);
      return (
        <TxComponent
          timestamp={item.timestamp}
          fees={parseFloat(fees?.amount || '0').toFixed(4)}
          title={title}
          image={image}
          chain={currentChain}
        />
      );
    },
    [currentChain, getCorrectImage, getCorrectTitle],
  );

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
        {convertedBalance?.balance?.amount}{' '}
        {convertedBalance?.balance?.denom.toUpperCase()}
      </Typography.H2>
      <Spacer paddingVertical={theme.spacing.s} />
      <Typography.H5>{t('operations')}</Typography.H5>
      {pastActionsData?.messages_by_address?.length >= 0 &&
      !operationsDataLoading ? (
        <SectionList
          refreshing={operationsDataLoading}
          onRefresh={operationsDataRefetch}
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyOperations}
          sections={operationsData}
          renderItem={renderTx}
          onEndReached={() => {
            operationsDataFetchMore({
              variables: {
                offset: pastActionsData?.messages_by_address.length,
              },
              updateQuery: (prev, {fetchMoreResult}) => {
                if (!fetchMoreResult) {
                  return prev;
                }
                return {
                  ...prev,
                  messages_by_address: [
                    ...prev.messages_by_address,
                    ...fetchMoreResult.messages_by_address,
                  ],
                };
              },
            });
          }}
          renderSectionHeader={({section: {section}}) => (
            <View style={styles.sectionHeader}>
              <Typography.Button2>{section}</Typography.Button2>
            </View>
          )}
        />
      ) : (
        <ActivityIndicator />
      )}
    </DView>
  );
};

export default Operations;

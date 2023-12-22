import { ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import Spacer from 'components/Spacer';
import { useTranslation } from 'react-i18next';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { DesmosProfile } from 'types/desmos';
import Button from 'components/Button';
import { useTheme } from 'native-base';
import { useSetLoginFlowState } from '@recoil/login';
import { LoginFlowStep } from 'types/login';
import { useAppStateValue } from '@recoil/appState';
import useTrackSelectedUsersToFollow from 'hooks/analytics/useTrackSelectedUsersToFollow';
import useStyles from './useStyles';
import { FollowCreatorsCallbacks, FollowedProfile, useCreators, useFollowCreators } from './hooks';
import CreatorListItem from './components/CreatorListItem';

export interface FollowCreatorsParams extends FollowCreatorsCallbacks {
  /**
   * Tells if the screen is being shown during the onboarding process.
   */
  readonly isOnboarding?: boolean;
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.FOLLOW_CREATORS>;

// The number of users that the current user must follow before
// they can continue with the onboarding process.
const MIN_FOLLOWAGE_COUNT = 3;

/**
 * Screen that will allow the user to follow their first creators.
 * This screen will be shown during the onboarding process.
 */
const FollowCreators: React.FC<NavProps> = ({ route: { params } }) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('onboarding');

  // -----------------------------------------------------
  // ----- States
  // -----------------------------------------------------

  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([]);

  // -----------------------------------------------------
  // ----- Hooks
  // -----------------------------------------------------

  const failedToFollowCreators = useAppStateValue('failedToFollowCreators');
  const { creators, loading, fetchMore, refresh, refreshing, followageCount } = useCreators();
  const { followCreators, broadcasting } = useFollowCreators(params);
  const setLoginFlowState = useSetLoginFlowState();
  const trackSelectedUsersToFollow = useTrackSelectedUsersToFollow();

  // -----------------------------------------------------
  // ----- Variables
  // -----------------------------------------------------

  const totalFollowageCount = React.useMemo(() => {
    return selectedAccounts.length + followageCount;
  }, [followageCount, selectedAccounts.length]);

  // -----------------------------------------------------
  // ----- Callbacks
  // -----------------------------------------------------

  const onAccountSelected = React.useCallback((profile: DesmosProfile, selected: boolean) => {
    if (selected) {
      setSelectedAccounts(currentAccounts => [...currentAccounts, profile.address]);
    } else {
      setSelectedAccounts(currentAccounts =>
        currentAccounts.filter(address => address !== profile.address),
      );
    }
  }, []);

  const renderItem = React.useCallback<ListRenderItem<FollowedProfile>>(
    ({ item }) => {
      const isSelected =
        item.following || selectedAccounts.findIndex(address => address === item.address) > -1;

      return (
        <CreatorListItem
          profile={item}
          onSelectChange={onAccountSelected}
          selected={isSelected}
          disabled={item.following}
        />
      );
    },
    [onAccountSelected, selectedAccounts],
  );

  const onNextPressed = React.useCallback(() => {
    if (selectedAccounts.length > 0) {
      followCreators(selectedAccounts);
      if (params.isOnboarding) {
        trackSelectedUsersToFollow();
      }
    } else {
      // If the user has not selected any creator,
      // it means that they are already following
      // the required number of creators.
      // Simulate a successful completed tx.
      params?.onStartBroadcasting?.();
      params?.onSuccess?.();
    }
  }, [followCreators, params, selectedAccounts, trackSelectedUsersToFollow]);

  // -----------------------------------------------------
  // ----- Effects
  // -----------------------------------------------------

  React.useEffect(() => {
    setLoginFlowState({
      step: LoginFlowStep.FollowCreators,
    });

    // Safe to ignore, we want to execute this effect just one time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Set the failed to follow creators as selected.
    setSelectedAccounts(failedToFollowCreators);

    // Safe to ignore, we just want to reload the failed to follow creators.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DView style={styles.root} topBar={<TopBar />} disableHideKeyboardTouchable>
      <Typography.Semibold24>{t('build your feed')}</Typography.Semibold24>
      <Spacer paddingTop="m" />
      <Typography.Body5>{t('follow 3 creators')}</Typography.Body5>

      <Spacer paddingTop="l" />

      <FlashList
        data={creators}
        renderItem={renderItem}
        estimatedItemSize={100}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        extraData={selectedAccounts}
        ListFooterComponent={<ActivityIndicator hidesWhenStopped animating={loading} />}
      />

      <Spacer paddingTop="l" />
      <Button
        disabled={totalFollowageCount < MIN_FOLLOWAGE_COUNT || broadcasting}
        bgColor={theme.colors.surfaceBlack}
        textColor={theme.colors.white}
        onPress={onNextPressed}>
        {t('next', { ns: 'common' })}
      </Button>

      <Spacer paddingBottom={58} />
    </DView>
  );
};

export default FollowCreators;

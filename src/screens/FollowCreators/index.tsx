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
import useStyles from './useStyles';
import { FollowedProfile, useCreators, useFollowCreators } from './hooks';
import CreatorListItem from './components/CreatorListItem';

export interface FollowCreatorsParams {
  /**
   * Callback that will be called when the user has finished the
   * following process.
   * This can be called in both cases, whether the transaction has been
   * performed successfully or not.
   * In case the transaction has failed, this screen will take care of storing
   * the accounts that the user wants to follow.
   */
  readonly onDone: () => void;
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.FOLLOW_CREATORS>;

// The number of users that the current user must follow before
// they can continue with the onboarding process.
const MIN_FOLLOWAGE_COUNT = 3;

/**
 * Screen that will allow the user to follow their first creators.
 * This screen will be shown during the onboarding process.
 */
const FollowCreators: React.FC<NavProps> = ({
  route: {
    params: { onDone },
  },
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('onboarding');

  // -----------------------------------------------------
  // ----- States
  // -----------------------------------------------------

  const [selectedAccounts, setSelectedAccounts] = React.useState<DesmosProfile[]>([]);

  // -----------------------------------------------------
  // ----- Hooks
  // -----------------------------------------------------

  const { creators, loading, fetchMore, refresh, refreshing, followageCount } = useCreators();
  const followCreators = useFollowCreators(onDone);
  const setLoginFlowState = useSetLoginFlowState();

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
      setSelectedAccounts(currentAccounts => [...currentAccounts, profile]);
    } else {
      setSelectedAccounts(currentAccounts =>
        currentAccounts.filter(account => account.address !== profile.address),
      );
    }
  }, []);

  const renderItem = React.useCallback<ListRenderItem<FollowedProfile>>(
    ({ item }) => {
      const isSelected =
        item.following ||
        selectedAccounts.findIndex(account => account.address === item.address) > -1;

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
    } else {
      onDone();
    }
  }, [followCreators, onDone, selectedAccounts]);

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
        disabled={totalFollowageCount < MIN_FOLLOWAGE_COUNT}
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

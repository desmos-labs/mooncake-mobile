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
import useStyles from './useStyles';
import { useCreators } from './hooks';
import CreatorListItem from './components/CreatorListItem';

export interface FollowCreatorsParams {}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.FOLLOW_CREATORS>;

/**
 * Screen that will allow the user to follow their first 3 creators.
 * This screen will be shown during the onboarding process.
 */
const FollowCreators: React.FC<NavProps> = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('onboarding');

  // -----------------------------------------------------
  // ----- Hooks
  // -----------------------------------------------------
  //
  const { creators, loading, fetchMore, refresh, refreshing } = useCreators();

  // -----------------------------------------------------
  // ----- Callbacks
  // -----------------------------------------------------

  const renderItem = React.useCallback<ListRenderItem<DesmosProfile>>(({ item }) => {
    return (
      <CreatorListItem profile={item} onSelectChange={() => {}} selected={false} disabled={true} />
    );
  }, []);

  const onNextPressed = React.useCallback(() => {
    console.warn('TODO: on next pressed');
  }, []);

  return (
    <DView style={styles.root} topBar={<TopBar />}>
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
        ListFooterComponent={<ActivityIndicator hidesWhenStopped animating={loading} />}
      />

      <Spacer paddingTop="l" />
      <Button
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

import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bgonboarding, onboarding1, onboarding2, onboarding3, onboarding4 } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import PaginationDots from 'components/PaginationDots';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import useTrackOnboardingCompleted from 'hooks/analytics/useTrackOnboardingCompleted';
import useGetLazyAuthorizationInformation from 'hooks/authorizations/useGetLazyAuthorizationInformation';
import useSetTourGuideStep from 'hooks/tourguide/useSetTourGuideStep';
import { getSaveProfileAllowance } from 'lib/grantsUtils';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, FlatList, ImageBackground, ListRenderItemInfo, View } from 'react-native';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';
import GetFeeGrant from 'services/axios/requests/GetFeeGrant';
import { AccountWithWallet } from 'types/account';
import { DesmosProfile } from 'types/desmos';
import { LoginOnboardingStep } from 'types/tourguide';
import useTrackOnboardingCompleted from 'hooks/analytics/useTrackOnboardingCompleted';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { err, ok } from 'neverthrow';
import useErrorModal from 'hooks/modals/useErrorModal';
import * as Sentry from 'sentry-expo';
import useStyles, { fixedWidth } from './useStyles';

export interface OnboardingParams {
  /**
   * Mode of the password manipulation.
   */
  passwordManipulationMode: PASSWORD_MANIPULATION_MODE;

  /**
   * Account that need to be saved.
   */
  account?: AccountWithWallet;

  /**
   * Profile that need to be saved.
   */
  profile?: DesmosProfile;
  /**
   * If the user needs to request the fee grant
   */
  requestFeeGrant?: boolean;
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.ONBOARDING>;

/**
 * Screen that is shown to the user in order to onboard.
 * @constructor
 */
const Onboarding = () => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('onboarding');

  const { navigate } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { account, requestFeeGrant } = params;

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------

  const [hasFeeGrant, setHasFeeGrant] = useState(requestFeeGrant !== true);
  const [feeGrantRequestFailed, setFeeGrantRequestFailed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slides: any[] = [
    {
      title: t('page1'),
      body: t('page1Sub'),
      image: onboarding1,
    },
    {
      title: t('page2'),
      body: t('page2Sub'),
      image: onboarding2,
    },
    {
      title: t('page3'),
      body: t('page3Sub'),
      image: onboarding3,
    },
    {
      title: t('page4'),
      body: t('page4Sub'),
      image: onboarding4,
    },
  ];

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const getAuthorizationInformation = useGetLazyAuthorizationInformation();
  const setTourGuideStep = useSetTourGuideStep();
  const trackOnboardingCompleted = useTrackOnboardingCompleted();
  const showErrorModal = useErrorModal();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  /**
   * Sign up the user and request the fee grant
   */
  const signUp = useCallback(async () => {
    if (account) {
      const getAuthorizationResult = await promiseToResult(
        getAuthorizationInformation(account.wallet.address),
        'Unknown error while getting authorization information',
      );
      if (getAuthorizationResult.isErr()) {
        return err(getAuthorizationResult.error);
      }
      const { feeGrants } = getAuthorizationResult.value;
      const saveProfileAllowance = getSaveProfileAllowance(feeGrants);
      // If has the save profile allowance
      if (saveProfileAllowance === undefined) {
        __DEV__ && console.log('[SignUp] Logged in and requested fee grant');
        const getFeegranteResult = await GetFeeGrant();
        if (getFeegranteResult.isErr()) {
          return err(getFeegranteResult.error);
        }
      } else {
        __DEV__ && console.log('[SignUp] Logged in, fee grant already requested and granted');
      }
    }
    return ok(undefined);
  }, [account, getAuthorizationInformation]);

  const requestGrant = useCallback(async () => {
    setHasFeeGrant(false);
    setFeeGrantRequestFailed(false);
    const signUpResult = await signUp();
    if (signUpResult.isErr()) {
      setFeeGrantRequestFailed(true);
      Sentry.Native.captureException(signUpResult.error);
      showErrorModal(
        t('an error occured while requesting the fee grant', {
          error: signUpResult.error.message,
        }),
        requestGrant,
      );
    } else {
      setHasFeeGrant(true);
    }
  }, [showErrorModal, signUp, t]);

  const onPressButton = useCallback(() => {
    if (currentIndex < 3) {
      slidesRef?.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      if (hasFeeGrant) {
        trackOnboardingCompleted();
        setTourGuideStep({ login: LoginOnboardingStep.Completed });
        navigate(ROUTES.PASSWORD_MANIPULATION, {
          mode: params.passwordManipulationMode,
          account: params.account,
          profile: params.profile,
        });
      } else if (feeGrantRequestFailed) {
        requestGrant();
      }
    }
  }, [
    currentIndex,
    feeGrantRequestFailed,
    hasFeeGrant,
    navigate,
    params.account,
    params.passwordManipulationMode,
    params.profile,
    requestGrant,
    setTourGuideStep,
    trackOnboardingCompleted,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    if (requestFeeGrant) {
      requestGrant();
    }
  }, [requestFeeGrant, requestGrant]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<any>) => {
      return (
        <View onStartShouldSetResponder={() => true} style={styles.slide}>
          <Image source={item.image} style={styles.imageStyle} contentFit="cover" />
          <View style={styles.textView}>
            <Spacer paddingBottom="m" />
            <Typography.Semibold24 style={CommonStyles.textAlign.center}>
              {item.title}
            </Typography.Semibold24>
            <Spacer paddingBottom="s" />
            <Typography.Regular14 style={CommonStyles.textAlign.center}>
              {item.body}
            </Typography.Regular14>
          </View>
        </View>
      );
    },
    [styles.imageStyle, styles.slide, styles.textView],
  );

  return (
    <DView topBar={<TopBar />} disableHideKeyboardTouchable={true} style={styles.root}>
      <ImageBackground source={bgonboarding} resizeMode="cover" style={styles.background} />
      <View style={styles.contentView} onStartShouldSetResponder={() => true}>
        <FlatList
          onStartShouldSetResponder={() => true}
          data={slides}
          renderItem={renderItem}
          pagingEnabled={true}
          horizontal={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          viewabilityConfig={viewConfig}
          onViewableItemsChanged={viewableItemsChanged}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
        <View style={styles.paginationView}>
          <PaginationDots pages={slides} scrollX={scrollX} width={fixedWidth} />
        </View>
        <Spacer paddingBottom="xl" />
        <Button
          size={44}
          backgroundColor={theme.colors.surfaceBlack}
          textColor={theme.colors.white}
          onPress={onPressButton}
          style={styles.button}>
          {feeGrantRequestFailed ? t('request grant') : t('next', { ns: 'common' })}
        </Button>
        <Spacer paddingBottom="xl" />
      </View>
    </DView>
  );
};

export default Onboarding;

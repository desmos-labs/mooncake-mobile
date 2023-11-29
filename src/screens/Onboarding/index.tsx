import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { onboarding1, onboarding2, onboarding3, onboarding4 } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import PaginationDots from 'components/PaginationDots';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import useGetLazyAuthorizationInformation from 'hooks/authorizations/useGetLazyAuthorizationInformation';
import useSetTourGuideStep from 'hooks/tourguide/useSetTourGuideStep';
import { getSaveProfileAllowance } from 'lib/grantsUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions, FlatList, ListRenderItemInfo, View } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';
import GetFeeGrant from 'services/axios/requests/GetFeeGrant';
import { AccountWithWallet } from 'types/account';
import { DesmosProfile } from 'types/desmos';
import { LoginOnboardingStep } from 'types/tourguide';

const fixedWidth = Dimensions.get('window').width;

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

const Onboarding = () => {
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { account, profile, passwordManipulationMode, requestFeeGrant } = params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const styles = useStyles();
  const slidesRef = useRef<FlatList>(null);
  const { t } = useTranslation('onboarding');
  const scrollX = useRef(new Animated.Value(0)).current;
  const getAuthorizationInformation = useGetLazyAuthorizationInformation();
  const setTourGuideStep = useSetTourGuideStep();

  const slides: any[] = [
    {
      title: t('onboarding title 1'),
      body: t('onboarding body 1'),
      image: onboarding1,
    },
    {
      title: t('onboarding title 2'),
      body: t('onboarding body 2'),
      image: onboarding2,
    },
    {
      title: t('onboarding title 3'),
      body: t('onboarding body 3'),
      image: onboarding3,
    },
    {
      title: t('onboarding title 4'),
      body: t('onboarding body 4'),
      image: onboarding4,
    },
  ];

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const onPressButton = useCallback(() => {
    if (currentIndex < 2) {
      slidesRef?.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      if (!loading) {
        setTourGuideStep({ login: LoginOnboardingStep.Completed });
        /*        navigate(ROUTES.ONBOARDING_INTERESTS, {
          account,
          profile,
          passwordManipulationMode,
          requestFeeGrant,
        });*/
      }
    }
  }, [
    account,
    currentIndex,
    loading,
    navigate,
    passwordManipulationMode,
    profile,
    requestFeeGrant,
    setTourGuideStep,
  ]);

  /**
   * Sign up the user and request the fee grant
   */
  const signUp = useCallback(async () => {
    if (account) {
      const { feeGrants } = await getAuthorizationInformation(account.wallet.address);
      const saveProfileAllowance = getSaveProfileAllowance(feeGrants);
      // If has the save profile allowance
      if (saveProfileAllowance === undefined) {
        await GetFeeGrant();
      }
    }
  }, [account, getAuthorizationInformation]);

  useEffect(() => {
    if (requestFeeGrant) {
      setLoading(true);
      signUp().then(() => {
        __DEV__ && console.log('[SignUp] Logged in and requested fee grant');
        setLoading(false);
      });
    }
  }, [account, params.requestFeeGrant, requestFeeGrant, signUp]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<any>) => {
      return (
        <View onStartShouldSetResponder={() => true} style={styles.slide}>
          <Image source={item.image} style={styles.imageStyle} contentFit="cover" />
          <View style={styles.textView}>
            <Spacer paddingBottom="m" />
            <Typography.H6 style={CommonStyles.textAlign.center}>{item.title}</Typography.H6>
            <Spacer paddingBottom="s" />
            <Typography.Body5 style={CommonStyles.textAlign.center}>{item.body}</Typography.Body5>
          </View>
        </View>
      );
    },
    [styles.imageStyle, styles.slide, styles.textView],
  );

  return (
    <DView topBar={<TopBar />} disableHideKeyboardTouchable={true} style={styles.root}>
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
        <Spacer paddingBottom="xxl" />
        <Button onPress={onPressButton} style={styles.button}>
          {currentIndex === 2 ? t('lets get started') : t('next', { ns: 'common' })}
        </Button>
        <Spacer paddingBottom="xxl" />
        <View style={{ alignSelf: 'center' }}>
          <PaginationDots pages={slides} scrollX={scrollX} width={fixedWidth} />
        </View>
      </View>
    </DView>
  );
};

const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  contentView: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    width: fixedWidth,
  },
  imageStyle: {
    width: verticalScale(300),
    height: verticalScale(300),
  },
  textView: {
    marginTop: 80,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    width: fixedWidth,
  },
  button: {
    marginHorizontal: theme.spacing.m,
  },
}));

export default Onboarding;

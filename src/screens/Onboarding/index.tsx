import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import {
  bgonboarding,
  onboarding1,
  onboarding2,
  onboarding3,
  onboarding4,
  onboardingLogo,
} from 'assets/images';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Animated as ClassicAnimated, Dimensions, Linking, View } from 'react-native';
import { ScalingDot } from 'react-native-animated-pagination-dots';
import FastImage, { Source } from 'react-native-fast-image';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { Box, useTheme } from 'native-base';
import CommonStyles from 'config/theme/CommonStyles';
import Button from 'components/Button';
import useStyles from './useStyles';

const AnimatedPagerView = ClassicAnimated.createAnimatedComponent(PagerView);

export interface OnboardingParams {
  invited?: boolean;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ONBOARDING>;

interface OnboardingData {
  imageSrc: Source;
  title: string;
  subtitle: string;
}

const Onboarding = () => {
  const { t } = useTranslation('onboarding');
  const { navigate } = useNavigation<NavProps['navigation']>();

  // Unwrap the params
  const { params } = useRoute<NavProps['route']>();
  const isInvited = params?.invited ?? false;

  const styles = useStyles();
  const theme = useTheme();

  const data: OnboardingData[] = [
    {
      imageSrc: onboarding1,
      title: t('page1'),
      subtitle: t('page1Sub'),
    },
    {
      imageSrc: onboarding2,
      title: t('page2'),
      subtitle: t('page2Sub'),
    },
    {
      imageSrc: onboarding3,
      title: t('page3'),
      subtitle: t('page3Sub'),
    },
    {
      imageSrc: onboarding4,
      title: t('page4'),
      subtitle: t('page4Sub'),
    },
  ];

  const { width } = Dimensions.get('window');
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new ClassicAnimated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new ClassicAnimated.Value(0)).current;
  const inputRange = [0, data.length];
  const scrollX = ClassicAnimated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate(
    {
      inputRange,
      outputRange: [0, data.length * width],
    },
  );

  const onPageScroll = React.useMemo(
    () =>
      ClassicAnimated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    [positionAnimatedValue, scrollOffsetAnimatedValue],
  );

  const navigateToCorrectScreen = useCallback(() => {
    navigate(ROUTES.LANDING, { invited: isInvited });
  }, [isInvited, navigate]);

  const renderItem = useCallback(
    (item: OnboardingData) => {
      return (
        <View key={item.title} style={styles.itemView}>
          <FastImage source={item.imageSrc} style={styles.image} resizeMode="cover" />
          <Typography.H3 style={{ marginTop: theme.spacing.xl }}>{item.title}</Typography.H3>
          <Spacer paddingVertical={theme.spacing.s} />
          <Typography.Body6 style={CommonStyles.textAlign.center}>{item.subtitle}</Typography.Body6>
        </View>
      );
    },
    [styles.image, styles.itemView, theme.spacing.s, theme.spacing.xl],
  );

  return (
    <DView
      disableHideKeyboardTouchable={true}
      style={styles.root}
      backgroundFillScreen={true}
      backgroundImage={bgonboarding}
      backgroundColor={theme.colors.background}>
      <FastImage source={onboardingLogo} style={styles.onboardingLogo} resizeMode="contain" />
      <AnimatedPagerView
        testID="onboardingPagerView"
        ref={ref}
        style={styles.pager}
        initialPage={0}
        onPageScroll={onPageScroll}>
        {data.map(item => {
          return renderItem(item);
        })}
      </AnimatedPagerView>
      <View style={styles.bottomItems}>
        <View style={styles.dotView}>
          <ScalingDot
            activeDotColor={theme.colors.butterOrange01}
            inActiveDotColor={theme.colors.lightGrey01}
            activeDotScale={1.1}
            inActiveDotOpacity={1}
            dotStyle={styles.dotStyle}
            data={data}
            // @ts-ignore
            scrollX={scrollX}
          />
        </View>
        <Button
          backgroundColor={theme.colors.surfaceBlack}
          textColor={theme.colors.white}
          size={44}
          style={styles.button}
          onPress={() => navigateToCorrectScreen()}>
          {t('get started')}
        </Button>
        <Box flex={1} margin="m">
          <Typography.Body6>
            <Trans
              i18nKey="mnemonicInput:userConsent"
              components={[
                <Typography.Body6
                  onPress={() => Linking.openURL('https://butter.social/terms-and-conditions')}
                  style={{ color: theme.colors.accentBlue01 }}
                />,
                <Typography.Body6
                  onPress={() => Linking.openURL('https://butter.social/privacy-policy')}
                  style={{ color: theme.colors.accentBlue01 }}
                />,
              ]}
            />
          </Typography.Body6>
        </Box>
      </View>
    </DView>
  );
};

export default Onboarding;

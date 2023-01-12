import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  bgonboarding,
  onboarding1,
  onboarding2,
  onboarding3,
  onboarding4,
} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated as ClassicAnimated, Dimensions, View} from 'react-native';
import {ScalingDot} from 'react-native-animated-pagination-dots';
import FastImage, {Source} from 'react-native-fast-image';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const AnimatedPagerView = ClassicAnimated.createAnimatedComponent(PagerView);

export interface OnboardingParams {
  invited: boolean;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ONBOARDING>;

interface OnboardingData {
  imageSrc: Source;
  title: string;
  subtitle: string;
}

const Onboarding = () => {
  const {t} = useTranslation('onboarding');
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {
    params: {invited},
  } = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();
  const [selected, setSelected] = useState(0);

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

  const {width} = Dimensions.get('window');
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(
    new ClassicAnimated.Value(0),
  ).current;
  const positionAnimatedValue = React.useRef(
    new ClassicAnimated.Value(0),
  ).current;
  const inputRange = [0, data.length];
  const scrollX = ClassicAnimated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, data.length * width],
  });

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
    [],
  );

  const navigateToCorrectScreen = useCallback(() => {
    if (invited) {
      navigate(ROUTES.SIGNUP);
    } else {
      navigate(ROUTES.LANDING);
    }
  }, [invited]);

  const renderItem = useCallback((item: OnboardingData) => {
    return (
      <View key={item.title} style={styles.itemView}>
        <Spacer paddingTop={50} paddingBottom={30}>
          <FastImage
            source={item.imageSrc}
            style={styles.image}
            resizeMode="cover"
          />
        </Spacer>
        <Typography.H3>{item.title}</Typography.H3>
        <Spacer paddingVertical={theme.spacing.s} />
        <Typography.Body6 style={{textAlign: 'center'}}>
          {item.subtitle}
        </Typography.Body6>
      </View>
    );
  }, []);

  return (
    <DView
      disableHideKeyboardTouchable={true}
      style={styles.root}
      backgroundFillScreen={true}
      backgroundImage={bgonboarding}
      backgroundColor={theme.colors.background}>
      <AnimatedPagerView
        ref={ref}
        style={{flex: 1}}
        initialPage={0}
        onPageScroll={onPageScroll}
        onPageSelected={(selectedEvent: any) =>
          setSelected(selectedEvent.nativeEvent.position)
        }>
        {data.map(item => {
          return renderItem(item);
        })}
      </AnimatedPagerView>
      {selected === 3 ? (
        <View style={{marginHorizontal: theme.spacing.m}}>
          <Button
            mode="contained"
            color={theme.colors.surfaceBlack}
            onPress={() => navigateToCorrectScreen()}>
            {t('join butter')}
          </Button>
        </View>
      ) : (
        <View style={styles.dotView}>
          <ScalingDot
            activeDotColor={theme.colors.butterOrange01}
            inActiveDotColor={theme.colors.lightGrey01}
            activeDotScale={1.2}
            inActiveDotOpacity={1}
            dotStyle={styles.dotStyle}
            data={data}
            // @ts-ignore
            scrollX={scrollX}
          />
        </View>
      )}
      <Spacer paddingTop={40} />
    </DView>
  );
};

export default Onboarding;

import {
  onboarding1,
  onboarding2,
  onboarding3,
  onboarding4,
} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated as ClassicAnimated, Dimensions, View} from 'react-native';
import {ScalingDot} from 'react-native-animated-pagination-dots';
import FastImage, {Source} from 'react-native-fast-image';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {useTheme} from 'react-native-paper';
import Animated, {FadeIn} from 'react-native-reanimated';
import useStyles from './useStyles';

const AnimatedPagerView = ClassicAnimated.createAnimatedComponent(PagerView);

/*
type Props = StackScreenProps<RootNavigatorParamList, ROUTES.ONBOARDING>;
*/

interface OnboardingData {
  imageSrc: Source;
  title: string;
  subtitle: string;
}

const Onboarding = () => {
  const {t} = useTranslation('onboarding');
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

  const renderItem = useCallback((item: OnboardingData) => {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          marginHorizontal: theme.spacing.s,
        }}>
        <Spacer paddingVertical={50}>
          <FastImage
            source={item.imageSrc}
            style={{height: 374, width: 374}}
            resizeMode="contain"
          />
        </Spacer>
        <Typography.H3>{item.title}</Typography.H3>
        <Spacer paddingVertical={theme.spacing.m} />
        <Typography.Body6 style={{textAlign: 'center'}}>
          {item.subtitle}
        </Typography.Body6>
      </View>
    );
  }, []);

  // @ts-ignore
  // @ts-ignore
  return (
    <DView
      disableHideKeyboardTouchable={true}
      style={styles.root}
      topBar={
        <TopBar
          noBackButton={true}
          rightElement={
            <Button
              mode="text"
              style={{
                right: 0,
                marginLeft: 'auto',
                marginVertical: theme.spacing.s,
              }}
              color={theme.colors.surfaceBlack}>
              <Typography.Button2>{t('skip')}</Typography.Button2>
            </Button>
          }
        />
      }
      backgroundColor={theme.colors.white}>
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
        <Animated.View entering={FadeIn.duration(300)}>
          <Button mode="contained" color={theme.colors.surfaceBlack}>
            {t('join butter')}
          </Button>
        </Animated.View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <ScalingDot
            activeDotColor={theme.colors.butterOrange01}
            inActiveDotColor={theme.colors.lightGrey01}
            activeDotScale={1.3}
            inActiveDotOpacity={1}
            dotStyle={{
              width: 8,
              height: 8,
              marginHorizontal: 6,
            }}
            data={data}
            // @ts-ignore
            scrollX={scrollX}
          />
        </View>
      )}
    </DView>
  );
};

export default Onboarding;

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
import {View} from 'react-native';
// @ts-ignore
import Dots from 'react-native-dots-pagination';
import FastImage, {Source} from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import {useTheme} from 'react-native-paper';
import Animated, {FadeIn} from 'react-native-reanimated';
import useStyles from './useStyles';

/*
type Props = StackScreenProps<RootNavigatorParamList, ROUTES.ONBOARDING>;
*/

interface OnboardingData {
  imageSrc: Source;
  title: string;
  subtitle: string;
  height: number;
  width: number;
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
      height: 316,
      width: 338,
    },
    {
      imageSrc: onboarding2,
      title: t('page2'),
      subtitle: t('page2Sub'),
      height: 316,
      width: 338,
    },
    {
      imageSrc: onboarding3,
      title: t('page3'),
      subtitle: t('page3Sub'),
      height: 316,
      width: 338,
    },
    {
      imageSrc: onboarding4,
      title: t('page4'),
      subtitle: t('page4Sub'),
      height: 316,
      width: 338,
    },
  ];

  const renderItem = useCallback((item: OnboardingData) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginHorizontal: theme.spacing.s,
        }}>
        <Spacer paddingVertical={50}>
          <FastImage
            source={item.imageSrc}
            style={{height: item.height, width: item.width}}
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
      <PagerView
        style={{flex: 1}}
        initialPage={0}
        onPageSelected={(event: any) =>
          setSelected(event.nativeEvent.position)
        }>
        {data.map(item => {
          return renderItem(item);
        })}
      </PagerView>
      {selected === 3 ? (
        <Animated.View entering={FadeIn.duration(250)}>
          <Button mode="contained" color={theme.colors.surfaceBlack}>
            {t('join butter')}
          </Button>
        </Animated.View>
      ) : (
        <Dots
          length={4}
          active={selected}
          activeColor={theme.colors.butterOrange01}
          passiveColor={theme.colors.lightGrey01}
          marginHorizontal={6}
          activeDotWidth={8}
          passiveDotWidth={8}
          activeDotHeight={8}
          passiveDotHeight={8}
        />
      )}
    </DView>
  );
};

export default Onboarding;

import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {StackScreenProps} from '@react-navigation/stack';
import {modalSuccess} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const WelcomePage: React.FC<Props> = props => {
  const {t} = useTranslation('common');
  const styles = useStyles();
  const theme = useTheme();
  const [bottomSheetPosition, setBottomSheetPosition] = useState(0);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%'], []);
  const progress = useDerivedValue(() => {
    return bottomSheetPosition === -1 ? withTiming(0) : withTiming(1);
  }, [bottomSheetPosition]);
  const rStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.1, 1]);

    return {opacity};
  });
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDimissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log(index);
    setBottomSheetPosition(index);
  }, []);

  const navigateToHome = useCallback(() => {
    console.log('nav');
  }, []);

  const navigateToBackupPhrase = useCallback(() => {
    console.log('nav');
  }, []);

  return (
    <DView style={[styles.root]} topBar={<TopBar stackProps={props} />}>
      <Animated.View style={rStyle}>
        <Image source={modalSuccess} style={styles.image} />
        <View style={styles.textContainer}>
          <Typography.H4>{t('congratulations')}</Typography.H4>
          <Typography.Body6>{t('dtag created')}</Typography.Body6>
        </View>
        <Button
          containerStyle={{marginBottom: theme.spacing.m}}
          mode="gradientFilled"
          onPress={navigateToHome}>
          <Typography.Button2 style={{color: theme.colors.white}}>
            {t('welcome to', {product: '[Product]'})}
          </Typography.Button2>
        </Button>
        <Button mode="outlined" onPress={navigateToBackupPhrase}>
          <Typography.Button2 style={{color: theme.colors.desmosOrange01}}>
            {t('backup phrase')}
          </Typography.Button2>
        </Button>
        <Button onPress={handlePresentModalPress}>
          <Typography.Subtitle4>{t('backup explanation')}</Typography.Subtitle4>
        </Button>
      </Animated.View>

      <BottomSheetModalProvider>
        <View>
          <BottomSheetModal
            enablePanDownToClose={false}
            backgroundStyle={{
              borderRadius: 24,
              backgroundColor: theme.colors.background,
            }}
            style={styles.bottomSheet}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onAnimate={handleSheetChanges}>
            <View
              style={{
                paddingHorizontal: theme.spacing.l,
                paddingTop: theme.spacing.l,
              }}>
              <Typography.H3 style={{marginBottom: theme.spacing.m}}>
                {t('welcomePage:why backup')}
              </Typography.H3>
              <Typography.Body6>
                {t('welcomePage:backup explanation')}
              </Typography.Body6>
              <Button
                containerStyle={{marginTop: theme.spacing.xl}}
                mode="gradientFilled"
                onPress={handleDimissModalPress}>
                <Typography.Button2 style={{color: theme.colors.white}}>
                  {t('i understand')}
                </Typography.Button2>
              </Button>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </DView>
  );
};

export default WelcomePage;

import {BlurView} from '@react-native-community/blur';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {profileBack} from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import {useTheme} from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import PropertiesSection from 'screens/NftDetails/components/PropertiesSection';
import UserBio from 'screens/Profile/components/UserBio';
import useStyles from './useStyles';

export type NftDetailsParams = {
  nftData: any;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.NFT_DETAILS>;

const NftDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {goBack} = useNavigation<NavProps['navigation']>();
  const {
    params: {nftData},
  } = useRoute<NavProps['route']>();
  const Image = createImageProgress(FastImage);

  const scrollProgress = useSharedValue(0);

  const animatedOpacityStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      scrollProgress.value,
      [0, 150],
      [1, 0],
      {extrapolateRight: Extrapolation.CLAMP},
    );
    return {opacity: interpolatedOpacity};
  });

  // Calculate the percentage of scroll and set it to shared value (30% OF THE SCREEN MAX)
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollProgress.value = event.contentOffset.y;
  });

  return (
    <>
      <>
        <Animated.View style={animatedOpacityStyle}>
          <View style={styles.imageAbsolute}>
            <Image
              source={{uri: nftData.image}}
              imageStyle={styles.backgroundImage}
            />
          </View>
        </Animated.View>
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={32}
          blurRadius={25}
          downsampleFactor={25}
          pointerEvents="none"
          reducedTransparencyFallbackColor="white"
        />
      </>
      <SafeAreaView>
        <ImageButton
          image={profileBack}
          style={styles.backImage}
          onPress={goBack}
        />
        <Animated.ScrollView
          style={styles.container}
          onScroll={scrollHandler}
          scrollEventThrottle={16}>
          <DropShadowWrapper
            style={styles.dropShadow}
            outerShadowProps={{
              startColor: 'rgba(16, 24, 40, 0.03)',
              distance: 10,
            }}>
            <Image
              source={{uri: nftData.image}}
              style={{
                width: '100%',
                height: 332,
              }}
              imageStyle={styles.nftImage}
            />
          </DropShadowWrapper>
          <View style={{margin: theme.spacing.m}}>
            <Typography.H5>
              {nftData.name}
              {' #'}
              {nftData.tokenId}
            </Typography.H5>
            <Spacer paddingVertical={6}>
              <UserBio content={nftData.description} />
            </Spacer>
            <Typography.Subtitle3
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{
                marginRight: theme.spacing.xl,
                color: theme.colors.midGrey,
              }}>
              Created by{'  '}
              <Typography.Body6>{nftData.creator}</Typography.Body6>
            </Typography.Subtitle3>
            <Typography.Subtitle3
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{
                marginRight: theme.spacing.xl,
                color: theme.colors.midGrey,
              }}>
              Owned by{'  '}
              <Typography.Body6>{nftData.owner}</Typography.Body6>
            </Typography.Subtitle3>
            <PropertiesSection nftData={nftData} />
            <Spacer paddingBottom={20} />
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
};

export default NftDetails;

import { BlurView } from '@react-native-community/blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { profileBack } from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import { Box, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { View } from 'react-native';
import { createImageProgress } from 'react-native-image-progress';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropertiesSection from 'screens/NftDetails/components/PropertiesSection';
import useStyles from './useStyles';

export type NftDetailsParams = {
  nftData: any;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.NFT_DETAILS>;

const NftDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { goBack } = useNavigation<NavProps['navigation']>();
  const {
    params: { nftData },
  } = useRoute<NavProps['route']>();
  const ImageProgress = createImageProgress(Image);

  const scrollProgress = useSharedValue(0);

  const animatedOpacityStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      scrollProgress.value,
      [0, 100],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity: interpolatedOpacity };
  });

  // Calculate the percentage of scroll and set it to shared value (30% OF THE SCREEN MAX)
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollProgress.value = event.contentOffset.y;
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <>
        <Animated.View style={animatedOpacityStyle}>
          <View style={styles.imageAbsolute}>
            <ImageProgress source={{ uri: nftData.image }} imageStyle={styles.backgroundImage} />
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
      <Box flex={1} mt="s">
        <ImageButton image={profileBack} style={styles.backImage} onPress={goBack} />
        <Animated.ScrollView
          style={styles.container}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}>
          <DropShadowWrapper
            style={styles.dropShadow}
            outerShadowProps={{
              startColor: 'rgba(16, 24, 40, 0.03)',
              distance: 10,
            }}>
            <ImageProgress
              source={{ uri: nftData.image }}
              style={styles.nftImageContainer}
              imageStyle={styles.nftImage}
            />
          </DropShadowWrapper>
          <Box m="m" flex={1}>
            <Spacer paddingTop={theme.spacing.m} paddingBottom={theme.spacing.l}>
              <Typography.H5>
                {nftData.name}
                {' #'}
                {nftData.tokenId}
              </Typography.H5>
            </Spacer>
            <Spacer paddingBottom={theme.spacing.l}>
              <Typography.Body6>{nftData.description}</Typography.Body6>
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
            <Spacer paddingBottom={4} />
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
          </Box>
        </Animated.ScrollView>
      </Box>
    </SafeAreaView>
  );
};

export default NftDetails;

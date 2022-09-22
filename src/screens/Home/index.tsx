import {StackScreenProps} from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import {
  commentIcon,
  defaultProfilePic,
  optionsIcon,
  plusWhiteIcon,
  tipIcon,
} from 'assets/images';
import DView from 'components/DView';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import useActiveAccount from 'hooks/useActiveAccount';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, LogBox, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/src/types';
import {verticalScale} from 'react-native-size-matters';
import {useRecoilState} from 'recoil';
import InteractionButton from 'screens/Home/components/InteractionButton';
import NoMorePosts from 'screens/Home/components/NoMorePosts';
import PostCard from 'screens/Home/components/PostCard';
import useHooks from 'screens/Home/useHooks';
import PostTypeTab from './components/PostTypeTab';
import useStyles from './useStyles';

// This warning is emitted from react-native-reanimated-carousel, but it
// does not affect operation
LogBox.ignoreLogs([/Cannot record touch end without a touch start./]);

export enum POST_TYPE {
  DISCOVER = 'DISCOVER_POSTS',
  FOLLOWING = 'FOLLOWING_POSTS',
}

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME>;

const Home = () => {
  const styles = useStyles();
  const {t} = useTranslation('home');

  const {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressTip,
    handlePressReactions,
    handlePressProfile,
    handlePressComments,
    selectedFilterIndex,
    // setSelectedFilterIndex,
    onPostChanged,
    postData,
    selectedPostIndex,
    handlePressCreatePost,
    loading,
    onCarouselProgressChange,
  } = useHooks();

  const {profileData} = useActiveAccount();
  const [{registeredReactions}] = useRecoilState(appSettingsState);
  const postTypes = [t(POST_TYPE.DISCOVER), t(POST_TYPE.FOLLOWING)];

  useEffect(() => {
    console.log(registeredReactions);
  }, []);

  const renderPost = React.useCallback(
    (info: CarouselRenderItemInfo<PostItem>) => {
      if (info.index === postData.length) {
        return <NoMorePosts />;
      }
      return (
        <PostCard
          postData={info.item}
          onPressAuthor={() => handlePressAuthor(info.item.author_address)}
          onPressDetails={() =>
            handlePressDetails(info.item.id, info.item.subspace_id)
          }
          onPressFollow={() => handlePressFollow(info.item.author_address)}
        />
      );
    },
    [postData, handlePressFollow, handlePressAuthor, handlePressDetails],
  );

  const profilePic = _.get(profileData, 'profile_pic');

  return (
    <DView style={styles.container} showLoadingOverlay={loading}>
      <View style={styles.headerGroup}>
        <ProfileHeaderButton
          style={styles.profileButton}
          imageSrc={profilePic ? {uri: profilePic} : defaultProfilePic}
          onPress={handlePressProfile}
        />

        <View style={styles.tabContainer}>
          <PostTypeTab
            selectedIndex={selectedFilterIndex}
            setSelectedIndex={() => {
              // temporarily disable switching to following as there is an
              // issue where attachments are cached and applied to incorrect posts
              console.log('disabled for now');
            }}
            postTypes={postTypes}
          />
        </View>

        <ProfileHeaderButton
          containerStyle={styles.createPostButton}
          style={styles.icon}
          imageSrc={plusWhiteIcon}
          onPress={handlePressCreatePost}
        />
      </View>

      <Carousel
        onProgressChange={onCarouselProgressChange}
        onSnapToItem={onPostChanged}
        mode="parallax"
        loop={false}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 60,
        }}
        width={Dimensions.get('window').width}
        height={verticalScale(500)}
        style={styles.carousel}
        data={[...postData, 0 as any]}
        renderItem={renderPost}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
          failOffsetY: [-10, 10],
        }}
      />

      {selectedPostIndex !== postData.length && (
        <View style={styles.interactionButtonGroup}>
          <InteractionButton
            onPress={() => handlePressComments()}
            interactionCount={10500}
            icon={commentIcon}
          />

          <InteractionButton
            onPress={handlePressReactions}
            interactionCount={100}
            icon={optionsIcon}
          />

          <InteractionButton
            onPress={handlePressTip}
            interactionCount={100000000}
            icon={tipIcon}
          />
        </View>
      )}
    </DView>
  );
};

export default Home;

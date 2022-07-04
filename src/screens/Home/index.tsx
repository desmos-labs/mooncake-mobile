import React from 'react';
import {Dimensions, View, LogBox} from 'react-native';
import ProfileHeaderButton from 'screens/Home/components/ProfileHeaderButton';
import {commentIcon, moreIcon, optionsIcon, tipIcon} from 'assets/images';
import Carousel from 'react-native-reanimated-carousel';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/src/types';
import PostCard from 'screens/Home/components/PostCard';
import {useGetPosts} from '@recoil/posts';
import DView from 'components/DView';
import InteractionButton from 'screens/Home/components/InteractionButton';
import {useTranslation} from 'react-i18next';
import PostTypeTab from './components/PostTypeTab';
import useStyles from './useStyles';

export enum POST_TYPE {
  DISCOVER = 'DISCOVER_POSTS',
  FOLLOWING = 'FOLLOWING_POSTS',
}

// This warning is emitted from react-native-reanimated-carousel, but it
// does not affect operation
LogBox.ignoreLogs([/Cannot record touch end without a touch start./]);

const Home = () => {
  const {t} = useTranslation('home');
  const styles = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  // const posts = useRecoilValue(postsState);
  const maxOffset = React.useRef<number>(0);

  const {posts, fetchNewPosts} = useGetPosts();

  // recalculate max carousel offset. This value is used to determine if the
  // carousel has been overscrolled
  React.useEffect(() => {
    maxOffset.current =
      Math.floor(Dimensions.get('window').width * (posts.length - 1)) * -1;
  }, [posts.length]);

  // fetch new posts before the user reaches the last post so they
  // will be enslaved by the app forever
  const onPostChanged = React.useCallback(
    (index: number) => {
      if (index >= posts.length - 2) {
        fetchNewPosts();
      }
    },
    [posts.length],
  );

  const postTypes = React.useMemo(() => {
    return [t(POST_TYPE.DISCOVER), t(POST_TYPE.FOLLOWING)];
  }, []);

  const handlePressAuthor = React.useCallback((address: string) => {
    console.log(address);
  }, []);

  const handlePressFollow = React.useCallback((address: string) => {
    console.log(address);
  }, []);

  const handlePressDetails = React.useCallback((postId: string) => {
    console.log(postId);
  }, []);

  const handlePressOptions = React.useCallback(() => {
    // TODO: implementation
  }, []);

  const handlePressComments = React.useCallback(() => {
    // TODO: implementation
  }, []);

  const handlePressTip = React.useCallback(() => {
    // TODO: implementation
  }, []);

  const renderPost = React.useCallback((info: CarouselRenderItemInfo<any>) => {
    return (
      <PostCard
        postData={info.item}
        onPressAuthor={() => handlePressAuthor('')}
        onPressDetails={() => handlePressDetails('')}
        onPressFollow={() => handlePressFollow('')}
      />
    );
  }, []);

  const onCarouselProgressChange = React.useCallback(
    (_: number, __: number, value: number) => {
      const offsetValue = value;
      // console.log(offsetValue, maxOffset.current);
      if (offsetValue > 0) {
        // do overscroll right things
      }
      if (offsetValue < maxOffset.current) {
        // do overscroll left things
      }
    },
    [maxOffset.current],
  );

  return (
    <DView style={styles.container}>
      <View style={styles.headerGroup}>
        <ProfileHeaderButton
          // TODO: replace this with user's image
          imageSrc={{uri: 'https://i.imgur.com/aih9snA.png'}}
          onPress={() => {
            console.log('shrek');
          }}
        />

        <View style={styles.tabContainer}>
          <PostTypeTab
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            postTypes={postTypes}
          />
        </View>

        <ProfileHeaderButton
          imageSrc={moreIcon}
          onPress={() => {
            console.log('more');
          }}
        />
      </View>

      <Carousel
        onProgressChange={onCarouselProgressChange}
        onSnapToItem={onPostChanged}
        mode="parallax"
        loop={false}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height * 0.7}
        data={posts}
        renderItem={renderPost}
      />

      <View style={styles.interactionButtonGroup}>
        <InteractionButton
          onPress={handlePressOptions}
          interactionCount={100}
          icon={optionsIcon}
        />

        <InteractionButton
          onPress={handlePressComments}
          interactionCount={10500}
          icon={commentIcon}
        />

        <InteractionButton
          onPress={handlePressTip}
          interactionCount={100000000}
          icon={tipIcon}
        />
      </View>
    </DView>
  );
};

export default Home;

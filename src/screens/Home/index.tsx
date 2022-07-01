import React from 'react';
import {Dimensions, View, LogBox} from 'react-native';
import ProfileHeaderButton from 'screens/Home/components/ProfileHeaderButton';
import {commentIcon, moreIcon, optionsIcon, tipIcon} from 'assets/images';
import Carousel from 'react-native-reanimated-carousel';
import {useRecoilValue} from 'recoil';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/src/types';
import PostCard from 'screens/Home/components/PostCard';
import {postsState} from '@recoil/posts';
import DView from 'components/DView';
import InteractionButton from 'screens/Home/components/InteractionButton';
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
  const styles = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const posts = useRecoilValue(postsState);

  const onPostChanged = React.useCallback(
    (index: number) => {
      console.log(index);
    },
    [posts],
  );

  const postTypes = React.useMemo(() => {
    return [POST_TYPE.DISCOVER, POST_TYPE.FOLLOWING];
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

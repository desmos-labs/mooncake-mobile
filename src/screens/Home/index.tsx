import React from 'react';
import {View} from 'react-native';
import ProfileHeaderButton from 'screens/Home/components/ProfileHeaderButton';
import {moreIcon} from 'assets/images';
import PostTypeTab from './components/PostTypeTab';
import useStyles from './useStyles';

//
export enum POST_TYPE {
  DISCOVER = 'DISCOVER_POSTS',
  FOLLOWING = 'FOLLOWING_POSTS',
}

const Home = () => {
  const styles = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const postTypes = React.useMemo(() => {
    return [POST_TYPE.DISCOVER, POST_TYPE.FOLLOWING];
  }, []);

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default Home;

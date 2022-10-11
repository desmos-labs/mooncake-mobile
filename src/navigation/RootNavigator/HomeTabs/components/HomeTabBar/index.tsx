import React from 'react';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import {defaultProfilePic, plusWhiteIcon} from 'assets/images';
import {View} from 'react-native';
import PostTypeTab from 'screens/Home/components/PostTypeTab';
import {useTranslation} from 'react-i18next';
import useStyles from './useStyles';

export enum POST_TYPE {
  DISCOVER = 'DISCOVER_POSTS',
  FOLLOWING = 'FOLLOWING_POSTS',
}

const HomeTabBar = (props: any) => {
  console.log(props);
  const styles = useStyles();

  const {t} = useTranslation('home');

  const postTypes = [t(POST_TYPE.DISCOVER), t(POST_TYPE.FOLLOWING)];

  return (
    <View style={styles.container}>
      <ProfileHeaderButton
        style={styles.profileButton}
        imageSrc={defaultProfilePic}
        onPress={() => {}}
      />

      <View style={styles.tabContainer}>
        <PostTypeTab
          selectedIndex={0}
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
        onPress={() => {}}
      />
    </View>
  );
};

export default HomeTabBar;

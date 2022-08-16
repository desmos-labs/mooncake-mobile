import React from 'react';
import DView from 'components/DView';
import {View, Image, ActivityIndicator, TextInput} from 'react-native';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import useActiveAccount from 'hooks/useActiveAccount';
import {defaultProfilePic} from 'assets/images';
import EnvConfig from 'config/EnvConfig';
import EnterCommentBottomPanel from './components/EnterCommentBottomPanel';
import useStyles from './useStyles';

export type EnterCommentParams = {
  /**
   * The author of the original post.
   */
  author: PostAuthor;

  /**
   * The id of the post that the reply belongs to.
   */
  postId: string;
};

const EnterComment = () => {
  const {t} = useTranslation('postInteraction');

  const styles = useStyles();

  const {profileData} = useActiveAccount();

  const [reply, setReply] = React.useState('');

  const TopBarRightElement = React.useMemo(() => {
    const handlePress = () => {
      console.log('pressed');
    };

    return (
      <Button
        mode="gradientFilled"
        onPress={handlePress}
        style={styles.postButton}>
        {t('post')}
      </Button>
    );
  }, []);

  return (
    <>
      <DView
        scrollable
        style={styles.container}
        topBar={
          <TopBar
            style={styles.topBar}
            centerText="hello world"
            rightElement={TopBarRightElement}
          />
        }>
        <View style={styles.contentContainer}>
          <View style={styles.avatarGroup}>
            {profileData ? (
              <Image
                source={profileData.profile_pic || defaultProfilePic}
                style={styles.avatar}
              />
            ) : (
              <ActivityIndicator style={styles.avatar} />
            )}
          </View>

          {/* this may get refactored into its own custom component */}
          <TextInput
            maxLength={EnvConfig.MAX_COMMENT_LENGTH}
            placeholder={t('yourReply')}
            value={reply}
            onChangeText={setReply}
            multiline
            style={{flex: 1, alignSelf: 'flex-start'}}
          />
        </View>
      </DView>
      <EnterCommentBottomPanel
        handlePressGallery={() => {
          console.log('placeholder');
        }}
        handlePressCamera={() => {
          console.log('placeholder');
        }}
        handlePressMention={() => {
          console.log('placeholder');
        }}
        commentLength={reply.length}
      />
    </>
  );
};

export default EnterComment;

import React from 'react';
import DView from 'components/DView';
import {View, Image, ActivityIndicator, TextInput} from 'react-native';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import useActiveAccount from 'hooks/useActiveAccount';
import {defaultProfilePic} from 'assets/images';
import {useTheme} from 'react-native-paper';
import EnterCommentBottomPanel from 'components/EnterComment/components/EnterCommentBottomPanel';
import EnvConfig from 'config/EnvConfig';

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

  const {profileData} = useActiveAccount();

  const theme = useTheme();

  const [reply, setReply] = React.useState('');

  const TopBarRightElement = React.useMemo(() => {
    const handlePress = () => {
      console.log('pressed');
    };

    return (
      <Button
        mode="gradientFilled"
        onPress={handlePress}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 35,
        }}>
        {t('post')}
      </Button>
    );
  }, []);

  return (
    <>
      <DView
        scrollable
        style={{flex: 1}}
        topBar={
          <TopBar
            style={{alignItems: 'center'}}
            centerText="hello world"
            rightElement={TopBarRightElement}
          />
        }>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 16,
            alignItems: 'center',
          }}>
          <View
            style={{
              alignSelf: 'flex-start',
              paddingTop: theme.spacing.s,
              marginRight: theme.spacing.m,
            }}>
            {profileData ? (
              <Image
                source={profileData.profile_pic || defaultProfilePic}
                style={{width: 40, height: 40, borderRadius: 20}}
              />
            ) : (
              <ActivityIndicator style={{width: 40, height: 40}} />
            )}
          </View>

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

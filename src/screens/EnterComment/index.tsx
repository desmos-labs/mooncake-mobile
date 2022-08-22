import React from 'react';
import DView from 'components/DView';
import {View, Image, ActivityIndicator, TextInput} from 'react-native';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import useActiveAccount from 'hooks/useActiveAccount';
import {defaultProfilePic} from 'assets/images';
import EnvConfig from 'config/EnvConfig';
import useImageFromDevice from 'hooks/useImageFromDevice';
import SelectedCommentImage from 'screens/EnterComment/components/SelectedCommentImage';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useRoute} from '@react-navigation/native';
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

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ENTER_COMMENT>;

const EnterComment = () => {
  const {t} = useTranslation('postInteraction');

  const styles = useStyles();

  const {profileData} = useActiveAccount();

  const {
    params: {author},
  } = useRoute<NavProps['route']>();

  const {image, clearImage, imageFromCamera, imageFromLibrary} =
    useImageFromDevice();

  const [reply, setReply] = React.useState('');

  const TopBarRightElement = React.useMemo(() => {
    const handlePress = () => {
      // these values will probably be useful in constructing the comment message
      console.log(image, reply, author);
    };

    return (
      <Button
        mode="gradientFilled"
        onPress={handlePress}
        style={styles.postButton}>
        {t('post')}
      </Button>
    );
  }, [image, reply]);

  return (
    <>
      <DView
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

        <SelectedCommentImage
          handlePress={clearImage}
          source={image ? {uri: image.uri} : ('' as any)}
        />
      </DView>
      <EnterCommentBottomPanel
        imageSelected={!!image}
        handlePressGallery={imageFromLibrary}
        handlePressCamera={imageFromCamera}
        handlePressMention={() => {
          console.log('placeholder');
        }}
        commentLength={reply.length}
      />
    </>
  );
};

export default EnterComment;

import Typography from 'components/Typography';
import React from 'react';
import DView from 'components/DView';
import {ActivityIndicator, Image, TextInput, View} from 'react-native';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import MediaBottomPanel from 'components/MediaBottomPanel';
import sharedCommentState, {commentTextState} from '@recoil/sharedCommentState';
import {useRecoilState, useResetRecoilState} from 'recoil';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import {
  PostReference,
  PostReferenceType,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import Long from 'long';
import useStyles from './useStyles';

export type EnterCommentParams = {
  /**
   * The author of the original post.
   */
  author: PostAuthor;

  /**
   * The id of the post that the reply belongs to.
   */
  postId: number;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ENTER_COMMENT>;

const EnterComment = () => {
  const {t} = useTranslation('postInteraction');

  const styles = useStyles();

  const {profileData} = useActiveAccount();

  const {goBack} = useNavigation();

  const [commentText, setCommentText] = useRecoilState(commentTextState);

  const resetSharedCommentData = useResetRecoilState(sharedCommentState);

  const {createPost} = useCreatePost();

  const [loading, setLoading] = React.useState(false);

  const {
    params: {author, postId},
  } = useRoute<NavProps['route']>();

  const {imageAsset, clearImage, imageFromCamera, imageFromLibrary} =
    useImageFromDevice();

  const TopBarRightElement = React.useMemo(() => {
    const handlePress = async () => {
      setLoading(true);
      await createPost({
        text: commentText,
        conversationId: postId,
        postReferences: [
          PostReference.fromPartial({
            type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
            postId: Long.fromNumber(postId),
          }),
        ],
      });

      resetSharedCommentData();
      setLoading(false);
      goBack();
    };

    return (
      <Button
        loading={loading}
        mode="contained"
        onPress={handlePress}
        style={styles.postButton}>
        <Typography.Button3 style={styles.postButtonText}>
          {t('post')}
        </Typography.Button3>
      </Button>
    );
  }, [imageAsset, commentText, loading]);

  const TopBarCenterElement = React.useMemo(() => {
    return (
      <Typography.Body7
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{textAlign: 'center'}}>
        {t('replyTo', {replyTo: `@${author.dtag}`})}
      </Typography.Body7>
    );
  }, []);

  return (
    <>
      <DView
        style={styles.container}
        topBar={
          <TopBar
            style={styles.topBar}
            centerElement={TopBarCenterElement}
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
            value={commentText}
            onChangeText={setCommentText}
            multiline
            style={{flex: 1, alignSelf: 'flex-start'}}
          />
        </View>

        <SelectedCommentImage
          handlePress={clearImage}
          source={imageAsset ? {uri: imageAsset.uri} : ('' as any)}
        />
      </DView>
      <MediaBottomPanel
        imageSelected={!!imageAsset}
        handlePressGallery={imageFromLibrary}
        handlePressCamera={imageFromCamera}
        handlePressMention={() => {
          console.log('placeholder');
        }}
        commentLength={commentText.length}
        style={styles.bottomPanel}
      />
    </>
  );
};

export default EnterComment;

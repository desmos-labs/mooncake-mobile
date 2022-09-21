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
import SelectedCommentImage from 'components/SelectedCommentImage';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import MediaBottomPanel from 'components/MediaBottomPanel';
import sharedPostState, {
  postAttachmentsState,
  postTextState,
} from '@recoil/sharedPostState';
import {useRecoilState, useResetRecoilState} from 'recoil';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import {
  Media,
  PostReference,
  PostReferenceType,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import Long from 'long';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {mediaToAny} from '@desmoslabs/desmjs/build/aminomessages/posts';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useStyles from './useStyles';

export type EnterCommentParams = {
  /**
   * The author of the original post.
   */
  author?: PostAuthor;

  /**
   * The id of the post that the reply belongs to.
   */
  postId?: number;

  /**
   * Is the user creating a post instead of commenting?
   */
  isCreatePost?: boolean;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ENTER_COMMENT>;

const EnterComment = () => {
  const {t} = useTranslation('postInteraction');

  const styles = useStyles();

  const {profileData} = useActiveAccount();

  const toast = useToast();

  const {goBack, navigate, pop} = useNavigation<NavProps['navigation']>();

  const [commentText, setCommentText] = useRecoilState(postTextState);
  const [commentAttachment, setCommentAttachment] =
    useRecoilState(postAttachmentsState);

  const resetSharedCommentData = useResetRecoilState(sharedPostState);

  const {createPost} = useCreatePost();

  const [loading, setLoading] = React.useState(false);

  const {
    params: {author, postId, isCreatePost},
  } = useRoute<NavProps['route']>();

  const {imageFromCamera, imageFromLibrary} = useImageFromDevice({
    onImageSelected: setCommentAttachment,
  });

  const handlePressGallery = React.useCallback(() => {
    if (isCreatePost) navigate(ROUTES.CREATE_POST_CAMERA_ROLL);
    else imageFromLibrary();
  }, [isCreatePost]);

  const handlePress = React.useCallback(async () => {
    try {
      setLoading(true);

      const isCreatingImagePost = isCreatePost && commentAttachment;

      const attachments = [];

      const conversationId = postId ? Long.fromNumber(postId) : undefined;

      const referencedPosts = postId
        ? [
            PostReference.fromPartial({
              type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
              postId: Long.fromNumber(postId),
            }),
          ]
        : [];

      if (commentAttachment && 'uri' in commentAttachment) {
        const uploadResponse = await UploadMedia({
          mediaFile: commentAttachment,
        });

        const {url} = uploadResponse!;

        const {type} = commentAttachment;

        const mediaAny = mediaToAny(
          Media.fromPartial({
            uri: url,
            mimeType: type,
          }),
        );

        attachments.push(mediaAny);
      }

      await createPost({
        text: commentText,
        attachments,
        referencedPosts,
        conversationId,
      });

      // EnterComment -> CreateTextPost -> Home
      if (isCreatingImagePost) {
        pop(2);
      } else {
        goBack();
      }

      resetSharedCommentData();
    } catch (err: any) {
      if (err.toString().includes('413')) {
        toast.show(t('error:imageTooLarge'), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [commentText, isCreatePost, commentText, commentAttachment]);

  const TopBarRightElement = React.useMemo(() => {
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
  }, [commentAttachment, handlePress, loading]);

  const TopBarCenterElement = React.useMemo(() => {
    if (isCreatePost) return undefined;
    return (
      <Typography.Body7
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{textAlign: 'center'}}>
        {t('replyTo', {replyTo: `@${author!.dtag}`})}
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
            placeholder={t(isCreatePost ? 'writeSomething' : 'yourReply')}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            style={{flex: 1, alignSelf: 'flex-start'}}
          />
        </View>

        <SelectedCommentImage
          handlePress={() => {
            setCommentAttachment(undefined);
          }}
          source={
            commentAttachment ? {uri: commentAttachment.uri} : ('' as any)
          }
        />
      </DView>
      <MediaBottomPanel
        imageSelected={!!commentAttachment}
        handlePressGallery={handlePressGallery}
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

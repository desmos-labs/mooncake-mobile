import Typography from 'components/Typography';
import React, { useCallback, useMemo, useState } from 'react';
import DView from 'components/DView';
import { ScrollView, TextInput, View } from 'react-native';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import useImageFromDevice from 'hooks/useImageFromDevice';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import MediaBottomPanel from 'components/MediaBottomPanel';
import { useTheme } from 'native-base';
import { Post } from 'types/posts';
import useCreatePost from 'hooks/posts/useCreatePost';
import {
  useAddCreatePostAttachment,
  useCreatePostValue,
  useRemoveCreatePostAttachment,
  useResetCreatePostState,
  useSetCreatePostValue,
} from '@recoil/screens/createPostState';
import useCustomToast from 'hooks/extended/useCustomToast';
import SelectedPostImage from 'components/SelectedPostImage';
import CommonStyles from 'config/theme/CommonStyles';
import StyledSpinner from 'components/StyledSpinner';
import usePostsParams from 'hooks/posts/usePostsParams';
import useStyles from './useStyles';

export type CreatePostParams = {
  /**
   * Parent of this post (i.e. if this post is a comment, or a reply to a comment).
   */
  parent?: Post;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.POST_CREATE>;

/**
 * Screen that allows to create a new post.
 *
 * <b>Note<b/>
 * This post works by editing the <code>createPostState</code> that might have already
 * been populated with some fields. When this screen opens, the current state is used.
 * The pots is later created using {@link useCreatePost}.
 * @constructor
 */
const CreatePost = () => {
  const { t } = useTranslation('postInteraction');
  const styles = useStyles();
  const theme = useTheme();
  const toast = useCustomToast();
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const parent = params?.parent;

  // -------------------------------------------------------------------------------------
  // --- Useful hooks
  // -------------------------------------------------------------------------------------

  const { params: postsParams } = usePostsParams();
  const resetCreatePostState = useResetCreatePostState();

  // TODO: Properly display the state of the creation of the post
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, createPost } = useCreatePost();

  // -------------------------------------------------------------------------------------
  // --- Post state
  // -------------------------------------------------------------------------------------

  const postText = useCreatePostValue('text');
  const setPostText = useSetCreatePostValue('text');
  const postAttachments = useCreatePostValue('attachments');
  const addPostAttachment = useAddCreatePostAttachment();
  const removePostAttachment = useRemoveCreatePostAttachment();

  const { imageFromCamera, imageFromLibrary } = useImageFromDevice({
    onImageSelected: addPostAttachment,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const canCreatePost = useMemo(() => {
    return postText.trim().length > 0 || postAttachments.length > 0;
  }, [postAttachments.length, postText]);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Callback used when the user wants to create the post
  const handleCreatePost = React.useCallback(async () => {
    setLoading(true);
    const result = await createPost(parent);
    setLoading(false);

    if (result.isErr()) {
      console.log('Error while creating post', result.error.message);
      return toast.errorNoRetry(t('errorWhileCreatingPost'));
    }

    navigation.goBack();
  }, [createPost, navigation, parent, t, toast]);

  const onCreatePostPressWrapper = useCallback(() => {
    requestAnimationFrame(async () => {
      await handleCreatePost();
    });
  }, [handleCreatePost]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const TopBarRightElement = React.useMemo(() => {
    if (loading) {
      return <StyledSpinner />;
    }

    return (
      <Button
        isLoading={loading}
        size={26}
        width={58}
        backgroundColor={theme.colors.primary}
        textColor={theme.colors.white}
        disabled={!canCreatePost}
        onPress={onCreatePostPressWrapper}>
        {t('post')}
      </Button>
    );
  }, [
    canCreatePost,
    onCreatePostPressWrapper,
    loading,
    t,
    theme.colors.primary,
    theme.colors.white,
  ]);

  const TopBarCenterElement = React.useMemo(() => {
    if (!parent) return undefined;
    return (
      <Typography.Body7
        numberOfLines={1}
        ellipsizeMode="tail"
        style={CommonStyles.textAlign.center}>
        {t('replyTo', { replyTo: `@${parent?.author.dTag}` })}
      </Typography.Body7>
    );
  }, [parent, t]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // When the user leaves the screen, we reset the state of the post and remove the attachment if any
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', () => {
        resetCreatePostState();
        removePostAttachment(postAttachments[0]);
      }),
    [navigation, postAttachments, removePostAttachment, resetCreatePostState],
  );

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
        <View>
          <ScrollView style={styles.contentContainer}>
            {/* this may get refactored into its own custom component */}
            <TextInput
              maxLength={postsParams.maxTextLength}
              placeholder={t(parent ? 'yourReply' : 'writeSomething')}
              placeholderTextColor={theme.colors.grey02}
              value={postText}
              onChangeText={setPostText}
              multiline
              style={{
                color: theme.colors.surfaceBlack,
              }}
              textAlignVertical="top"
            />
            {/* TODO: Allow to select multiple attachments */}
            <SelectedPostImage
              source={postAttachments.length > 0 ? { uri: postAttachments[0].uri } : ('' as any)}
              dimensions={{
                width: postAttachments.length > 0 ? postAttachments[0].width : undefined,
                height: postAttachments.length > 0 ? postAttachments[0].height : undefined,
              }}
              handlePress={source => removePostAttachment(source)}
            />
          </ScrollView>
        </View>
      </DView>
      <MediaBottomPanel
        style={styles.bottomPanel}
        commentLength={postText.length}
        imageSelected={postAttachments.length > 0}
        handlePressGallery={imageFromLibrary}
        handlePressCamera={imageFromCamera}
      />
    </>
  );
};

export default CreatePost;

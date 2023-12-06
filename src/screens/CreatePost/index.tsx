import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import {
  useAddCreatePostAttachment,
  useCreatePostValue,
  useRemoveCreatePostAttachment,
  useResetCreatePostState,
  useSetCreatePostValue,
} from '@recoil/screens/createPostState';
import { useSetPostsListState } from '@recoil/screens/postsListState';
import Button from 'components/Button';
import DView from 'components/DView';
import MediaBottomPanel from 'components/MediaBottomPanel';
import SelectedPostImage from 'components/SelectedPostImage';
import StyledSpinner from 'components/StyledSpinner';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { ToastType } from 'config/toast/toastConfig';
import { CameraType } from 'expo-image-picker';
import useTakePicture, { TakePictureActionResults } from 'hooks/camera/useTakePicture';
import useCreatePost from 'hooks/posts/useCreatePost';
import usePostsParams from 'hooks/posts/usePostsParams';
import useToast from 'hooks/toasts/useToast';
import useImageFromDevice from 'hooks/useImageFromDevice';
import useOpenPictureEditor from 'hooks/useOpenPictureEditor';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TextInput, View } from 'react-native';
import { Post } from 'types/posts';
import useStyles from './useStyles';

export type CreatePostParams = {
  /**
   * Parent of this post (i.e. if this post is a comment, or a reply to a comment).
   */
  parent?: Post;

  /**
   * Disable swipe to go back. Useful if the UI needs to be blocked for async operations.
   */
  disableBackSwipe: boolean;
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
  const showToast = useToast();
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
  const setPostsListState = useSetPostsListState();

  // -------------------------------------------------------------------------------------
  // --- Post state
  // -------------------------------------------------------------------------------------

  const postText = useCreatePostValue('text');
  const setPostText = useSetCreatePostValue('text');
  const postAttachments = useCreatePostValue('attachments');
  const addPostAttachment = useAddCreatePostAttachment();
  const removePostAttachment = useRemoveCreatePostAttachment();
  const { editPostPicture } = useOpenPictureEditor();
  const takePhoto = useTakePicture();

  const { imageFromLibrary: selectPicture } = useImageFromDevice({
    onImageSelected: imageUri => {
      editPostPicture(imageUri, (editedPicturePath, dimensions) => {
        addPostAttachment({
          uri: editedPicturePath,
          width: dimensions.width,
          height: dimensions.height,
        });
      });
    },
  });

  const handleTakePicture = useCallback(async () => {
    takePhoto(CameraType.front).then(result => {
      if (result?.status === TakePictureActionResults.Taken) {
        const imageUri = result.uri;
        editPostPicture(imageUri, (editedPicturePath, dimensions) => {
          addPostAttachment({
            uri: editedPicturePath,
            width: dimensions.width,
            height: dimensions.height,
          });
        });
      }
    });
  }, [addPostAttachment, editPostPicture, takePhoto]);

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
      showToast({
        toastType: ToastType.error,
        title: t('error', { ns: 'common' }),
        message: t('errorWhileCreatingPost'),
      });
      return;
    }

    // If the post is a root post AKA has no parent, we need to scroll to top the home posts list
    if (!parent) {
      setPostsListState(value => ({ ...value, scrollToTop: true }));
    }

    navigation.goBack();
  }, [createPost, navigation, parent, setPostsListState, showToast, t]);

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
        width={61}
        backgroundColor={theme.colors.primary}
        textColor={theme.colors.white}
        disabled={!canCreatePost}
        height="32px"
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
    if (!parent) {
      return undefined;
    }
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

  // Disable iOS swipe to go back if the create post state is loading
  React.useEffect(() => {
    if (loading) {
      navigation.setParams({
        ...params,
        disableBackSwipe: true,
      });
    } else {
      navigation.setParams({
        ...params,
        disableBackSwipe: false,
      });
    }
    // Safe to ignore as we only want to call this effect when the loading state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      <DView
        style={styles.container}
        backgroundColor={theme.colors.white}
        topBar={
          <TopBar
            style={styles.topBar}
            centerElement={TopBarCenterElement}
            rightElement={TopBarRightElement}
            disableBackButton={loading}
          />
        }>
        <View>
          <ScrollView style={styles.contentContainer}>
            {/* this may get refactored into its own custom component */}
            <TextInput
              autoFocus={true}
              maxLength={postsParams.maxTextLength}
              placeholder={t(parent ? 'yourReply' : 'writeSomething')}
              placeholderTextColor={theme.colors.grey02}
              value={postText}
              onChangeText={setPostText}
              multiline
              style={styles.input}
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
        handlePressGallery={selectPicture}
        handlePressCamera={handleTakePicture}
      />
    </>
  );
};

export default CreatePost;

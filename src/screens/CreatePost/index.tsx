import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
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
import MediaBottomPanel, { OnImageSelectedCallback } from 'components/MediaBottomPanel';
import SelectedPostImage from 'components/SelectedPostImage';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import TopBar from 'components/TopBar';
import CommonStyles from 'config/theme/CommonStyles';
import { ToastType } from 'config/toast/toastConfig';
import useCreatePost from 'hooks/posts/useCreatePost';
import usePosts, { PostsQueryType } from 'hooks/posts/usePosts';
import usePostsParams from 'hooks/posts/usePostsParams';
import useToast from 'hooks/toasts/useToast';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from 'types/posts';
import useStyles from './useStyles';

export type CreatePostParams = {
  /**
   * Parent of this post (i.e. if this post is a comment, or a reply to a comment).
   */
  parent?: Post;

  /**
   * Disable swipe to go back. Useful if the UI needs to be blocked for async operations.
   * Defaults to false.
   */
  disableBackSwipe?: boolean;
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
  const { t } = useTranslation('createPost');
  const styles = useStyles();
  const theme = useTheme();
  const showToast = useToast();
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const parent = params?.parent;
  const insets = useSafeAreaInsets();
  // -------------------------------------------------------------------------------------
  // --- Useful hooks
  // -------------------------------------------------------------------------------------

  const { params: postsParams } = usePostsParams();
  const resetCreatePostState = useResetCreatePostState();
  const { refresh } = usePosts(PostsQueryType.DISCOVERY);
  const createPost = useCreatePost();
  const setPostsListState = useSetPostsListState();

  // -------------------------------------------------------------------------------------
  // --- Post state
  // -------------------------------------------------------------------------------------

  const postText = useCreatePostValue('text');
  const setPostText = useSetCreatePostValue('text');
  const postAttachments = useCreatePostValue('attachments');
  const addPostAttachment = useAddCreatePostAttachment();
  const removePostAttachment = useRemoveCreatePostAttachment();

  const onImageSelected = useCallback<OnImageSelectedCallback>(
    (editedPicturePath, dimensions, mimeType) => {
      addPostAttachment({
        uri: editedPicturePath,
        width: dimensions.width,
        height: dimensions.height,
        type: mimeType,
      });
    },
    [addPostAttachment],
  );

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
    const result = await createPost({ parent, onProcessCompleted: refresh });
    setLoading(false);

    if (result.isErr()) {
      showToast({
        toastType: ToastType.error,
        title: t('error', { ns: 'common' }),
        message: result.error.message,
      });
      return;
    }

    // If the post is a root post AKA has no parent, we need to scroll to top the home posts list
    if (!parent) {
      setPostsListState(value => ({ ...value, scrollToTop: true }));
    }

    navigation.goBack();
  }, [createPost, navigation, parent, refresh, setPostsListState, showToast, t]);

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
        loading={loading}
        height={32}
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
    if (!parent) {
      return undefined;
    }
    return (
      <Typography.Regular12
        numberOfLines={1}
        ellipsizeMode="tail"
        style={CommonStyles.textAlign.center}>
        {t('reply to', { name: `@${parent?.author.dTag}` })}
      </Typography.Regular12>
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
    <View style={styles.root}>
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
              placeholder={parent ? t('your reply') : t('write something')}
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
        onImageSelected={onImageSelected}
      />
      <Spacer paddingBottom={insets.bottom} />
    </View>
  );
};

export default CreatePost;

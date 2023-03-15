import Typography from 'components/Typography';
import React, { useState } from 'react';
import DView from 'components/DView';
import { TextInput, View } from 'react-native';
import TopBar from 'components/TopBar';
import Button, { ButtonMode, ButtonSize } from 'components/Button';
import { useTranslation } from 'react-i18next';
import EnvConfig from 'config/EnvConfig';
import useImageFromDevice from 'hooks/useImageFromDevice';
import SelectedCommentImage from 'components/SelectedCommentImage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import MediaBottomPanel from 'components/MediaBottomPanel';
import { useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Post } from 'types/posts';
import { useActiveProfile } from '@recoil/profiles';
import useCreatePost from 'hooks/posts/useCreatePost';
import { getProfilePicture } from 'lib/ProfileUtils';
import {
  useAddCreatePostAttachment,
  useCreatePostValue,
  useRemoveCreatePostAttachment,
  useSetCreatePostValue,
} from '@recoil/screens/createPostState';
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

  const { goBack } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const parent = params?.parent;

  // -------------------------------------------------------------------------------------
  // --- Useful hooks
  // -------------------------------------------------------------------------------------

  const author = useActiveProfile();

  // TODO: Properly display the state of the creation of the post
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

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Callback used when the user wants to create the post
  const handleCreatePost = React.useCallback(async () => {
    setLoading(true);
    const result = await createPost(parent);
    setLoading(false);

    if (result.isErr()) {
      // TODO: Show the error somehow
      console.log('Error while creating post', result.error.message);
      return;
    }

    goBack();
  }, [createPost, goBack, parent]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const TopBarRightElement = React.useMemo(() => {
    return (
      <Button
        loading={loading}
        mode={ButtonMode.CONTAINED}
        backgroundColor={theme.colors.primary}
        textColor={theme.colors.white}
        size={ButtonSize.S}
        onPress={handleCreatePost}
        additionalStyle={styles.postButton}>
        {t('post')}
      </Button>
    );
  }, [handleCreatePost, loading, styles.postButton, styles.postButtonText, t]);

  const TopBarCenterElement = React.useMemo(() => {
    if (!parent) return undefined;
    return (
      <Typography.Body7 numberOfLines={1} ellipsizeMode="tail" style={{ textAlign: 'center' }}>
        {t('replyTo', { replyTo: `@${parent?.author.dTag}` })}
      </Typography.Body7>
    );
  }, [parent, t]);

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
            <FastImage source={getProfilePicture(author)} style={styles.avatar} />
          </View>

          {/* this may get refactored into its own custom component */}
          <TextInput
            maxLength={EnvConfig.MAX_COMMENT_LENGTH}
            placeholder={t(parent ? 'yourReply' : 'writeSomething')}
            placeholderTextColor={theme.colors.grey02}
            value={postText}
            onChangeText={setPostText}
            multiline
            style={{
              flex: 1,
              alignSelf: 'stretch',
              color: theme.colors.surfaceBlack,
            }}
            textAlignVertical="top"
          />
        </View>

        {/* TODO: Allow to select multiple attachments */}
        <SelectedCommentImage
          source={postAttachments.length > 0 ? { uri: postAttachments[0].uri } : ('' as any)}
          handlePress={source => removePostAttachment(source)}
        />
      </DView>
      <MediaBottomPanel
        style={styles.bottomPanel}
        commentLength={postText.length}
        imageSelected={postAttachments.length > 0}
        handlePressGallery={imageFromLibrary}
        handlePressCamera={imageFromCamera}
        handlePressMention={() => {
          console.log('placeholder');
        }}
      />
    </>
  );
};

export default CreatePost;

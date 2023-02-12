import Typography from 'components/Typography';
import React from 'react';
import DView from 'components/DView';
import { Platform, TextInput, View } from 'react-native';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import EnvConfig from 'config/EnvConfig';
import useImageFromDevice from 'hooks/useImageFromDevice';
import SelectedCommentImage from 'components/SelectedCommentImage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import MediaBottomPanel from 'components/MediaBottomPanel';
import { useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Post } from 'types/posts';
import { useActiveProfile } from '@recoil/profiles';
import useCreatePost from 'hooks/useCreatePost';
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

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CREATE_POST>;

/**
 * Screen that allows to create a new post.
 *
 * <b>Note<b/>
 * This post works by editing the <code>createPostState</code> that might have already
 * been populated with some fields. When this screen opens, the current state is used.
 * The pots is later created using {@link useCreatePost}.
 * @constructor
 */
const CreatePost = (props: NavProps) => {
  const { goBack } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('postInteraction');
  const styles = useStyles();
  const theme = useTheme();
  const { route } = props;
  const { params } = route;
  const parent = params?.parent;

  // -------------------------------------------------------------------------------------
  // --- Useful hooks
  // -------------------------------------------------------------------------------------

  const author = useActiveProfile();
  const { loading, createPost } = useCreatePost(parent);

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

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Callback used when the user wants to create the post
  const handleCreatePost = React.useCallback(async () => {
    const result = await createPost();
    if (result.isErr()) {
      // TODO: Show the error somewhat
      console.log('Error while creating post', result.error.message);
    } else {
      goBack();
    }
  }, [createPost, goBack]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const TopBarRightElement = React.useMemo(() => {
    return (
      <Button
        loading={loading}
        mode="contained"
        onPress={handleCreatePost}
        contentStyle={Platform.OS === 'android' && { height: '100%', width: 64 }}
        style={styles.postButton}>
        <Typography.Button3 style={styles.postButtonText}>{t('post')}</Typography.Button3>
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

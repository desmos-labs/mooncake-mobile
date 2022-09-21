import React, {useRef} from 'react';
import {
  View,
  Image,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {postBG} from 'assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import RadialTextCounter from 'components/RadialTextCounter';
import EnvConfig from 'config/EnvConfig';
import _ from 'lodash';
import {useTheme} from 'react-native-paper';
import {useRecoilState, useRecoilValue} from 'recoil';
import {postParamsState} from '@recoil/postParamsState';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import LoadingOverlay from 'components/LoadingOverlay';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import BackButton from 'components/BackButton';
import {postTextState} from '@recoil/sharedPostState';
import BottomBar from './components/BottomBar';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_TEXT_POST
>;

const CreateTextPost = () => {
  const styles = useStyles();
  const theme = useTheme();

  const {t} = useTranslation('createPost');
  const postParams = useRecoilValue(postParamsState);
  const [sharedComment, setSharedComment] = useRecoilState(postTextState);
  const {createPost, loading} = useCreatePost();
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();

  const [backgroundIndex, setBackgroundIndex] = React.useState(
    _.random(0, postBG.length),
  );
  const inputRef = useRef<any>();

  const handlePressBGButton = React.useCallback(() => {
    setBackgroundIndex(prev => (prev < postBG.length ? prev + 1 : 0));
  }, [backgroundIndex]);

  const inputOpacity = React.useMemo(() => {
    if (!inputRef.current || sharedComment.length === 0) return 0.8;
    return 1;
  }, [inputRef.current, sharedComment]);

  const handlePostPressed = React.useCallback(() => {
    if (inputRef.current) {
      const focused = inputRef.current?.isFocused();

      if (focused) {
        inputRef.current?.blur();
      } else inputRef.current?.focus();
    }
  }, [inputRef.current]);

  const handleSubmitPost = React.useCallback(async () => {
    const createPostResponse = await createPost({text: sharedComment});

    if (createPostResponse) {
      goBack();
    } else {
      console.log('something went wrong while submitting post');
    }
  }, [createPost, sharedComment]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeAreaContainer}>
        <TouchableOpacity
          onPress={handlePostPressed}
          activeOpacity={1}
          style={styles.postContainer}>
          <Image source={postBG[backgroundIndex]} style={styles.background} />

          <View style={styles.headerGroup}>
            <BackButton
              onPress={goBack}
              // index 0 is black, which makes the default back button color hard to see
              iconColor={backgroundIndex === 0 ? theme.colors.white : undefined}
            />

            <TouchableOpacity onPress={handlePressBGButton}>
              <Image
                source={postBG[backgroundIndex]}
                style={styles.switchBgButton}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
            keyboardVerticalOffset={50}>
            <TextInput
              maxLength={postParams.max_text_length}
              ref={inputRef}
              value={sharedComment}
              multiline
              onChangeText={setSharedComment}
              placeholder={t('tapToType')}
              style={[styles.inputStyle, {opacity: inputOpacity}]}
              placeholderTextColor="#FFFFFF"
            />
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
        style={styles.textCounterContainer}
        // android pushes the text counter up excessively, so we need to use this offset
        keyboardVerticalOffset={Platform.select({
          android: -200,
        })}>
        <RadialTextCounter
          max={EnvConfig.MAX_COMMENT_LENGTH}
          current={sharedComment.length}
          customEmptyColor="rgba(255,255,255,0.3)"
          customFillColor={theme.colors.white}
        />
      </KeyboardAvoidingView>
      <BottomBar
        handlePressPost={handleSubmitPost}
        handlePressGallery={() => navigate(ROUTES.CREATE_POST_CAMERA_ROLL)}
      />

      <LoadingOverlay isVisible={loading} />
    </View>
  );
};

export default CreateTextPost;

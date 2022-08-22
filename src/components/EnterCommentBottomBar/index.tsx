import {expandCommentIcon} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import ImageButton from 'components/ImageButton';
import MediaBottomPanel from 'components/MediaBottomPanel';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Shadow} from 'react-native-shadow-2';
import useStyles from './useStyles';

export type Props = {
  /**
   * Source of the image to display
   */
  profileImage: React.ComponentProps<typeof ProfileHeaderButton>['imageSrc'];
  /**
   * Action to execute when the right icon is pressed
   */
  onIconPress: () => void;
};

const EnterCommentBottomBar: React.FC<Props> = props => {
  const {profileImage, onIconPress} = props;
  const {t} = useTranslation('comment');
  const styles = useStyles();
  const theme = useTheme();
  const [comment, setComment] = React.useState<string>('');

  const rightButtonComponent = useMemo(() => {
    return (
      <Button
        mode="gradientFilled"
        disabled={comment.length === 0}
        containerStyle={styles.postButton}
        onPress={() => console.log('post it')}>
        <Typography.Button3 style={{color: theme.colors.white}}>
          {t('post')}
        </Typography.Button3>
      </Button>
    );
  }, [comment]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      behavior={Platform.OS === 'ios' ? 'position' : undefined}>
      <Shadow
        viewStyle={styles.shadow}
        startColor="rgba(51, 51, 51, 0.15)"
        distance={30}
        radius={0}>
        <View style={styles.container}>
          {profileImage ? (
            <Image source={profileImage} style={styles.profilePic} />
          ) : (
            <ActivityIndicator style={styles.profilePic} />
          )}
          <DTextInput
            maxLength={EnvConfig.MAX_COMMENT_LENGTH}
            value={comment}
            onChangeText={text => setComment(text)}
            multiline={true}
            style={styles.textInput}
            placeholder={t('write a comment')}
            rightElement={
              <ImageButton image={expandCommentIcon} onPress={onIconPress} />
            }
          />
        </View>
        <MediaBottomPanel
          imageSelected={false}
          handlePressGallery={() => console.log('test')}
          handlePressCamera={() => console.log('test')}
          handlePressMention={() => {
            console.log('placeholder');
          }}
          rightComponent={rightButtonComponent}
          commentLength={comment.length}
        />
      </Shadow>
    </KeyboardAvoidingView>
  );
};

export default EnterCommentBottomBar;

import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { Asset } from 'react-native-image-picker';
import useUploadPictures, {
  PictureType,
  UploadPictureStateType,
} from 'screens/Modals/UploadProfilePicturesModal/hooks';
import { useTranslation } from 'react-i18next';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import { useTheme } from 'native-base';
import Button from 'components/CustomButton';
import useStyles from './useStyles';

export interface UploadPicturesSuccess {
  readonly profilePictureUrl?: string;
  readonly coverPictureUrl?: string;
}

export interface SaveProfileModalParams {
  profilePicture?: Asset;
  coverPicture?: Asset;
  onUploadSuccess: (params: UploadPicturesSuccess) => any;
  onCancel: () => any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.UPLOAD_PROFILE_PICTURES_MODALS>;

const UploadProfilePicturesModal: React.FC<NavProps> = ({ route }) => {
  const { t } = useTranslation('uploadProfilePictures');
  const theme = useTheme();
  const styles = useStyles();
  const { profilePicture, coverPicture, onUploadSuccess, onCancel } = route.params;
  const { state, retry } = useUploadPictures(profilePicture, coverPicture);
  useOnBackAction(onCancel, []);

  const uiMessage = React.useMemo(() => {
    switch (state.type) {
      case UploadPictureStateType.Uploading:
        return state.pictureType === PictureType.Profile
          ? t('uploading profile picture')
          : t('uploading cover picture');
      case UploadPictureStateType.Completed:
        return t('upload completed');
      case UploadPictureStateType.Failed:
        return state.pictureType === PictureType.Profile
          ? t('profile picture upload failed')
          : t('profile picture upload failed');
      default:
        return t('unknown upload state');
    }
  }, [state, t]);

  const btnText = React.useMemo(() => {
    switch (state.type) {
      case UploadPictureStateType.Uploading:
        return t('uploading pictures');
      case UploadPictureStateType.Completed:
        return t('common:continue');
      case UploadPictureStateType.Failed:
        return t('common:retry');
      default:
        return '';
    }
  }, [state, t]);

  const handleBtnPress = React.useCallback(() => {
    if (state.type === UploadPictureStateType.Completed) {
      onUploadSuccess({
        profilePictureUrl: state.profilePictureUrl,
        coverPictureUrl: state.coverPictureUrl,
      });
    } else if (state.type === UploadPictureStateType.Failed) {
      retry();
    }
  }, [onUploadSuccess, retry, state]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Typography.Body5 style={styles.message}>{uiMessage}</Typography.Body5>
        <Button
          size={44}
          textColor={theme.colors.white}
          backgroundColor={theme.colors.surfaceBlack}
          onPress={handleBtnPress}
          disabled={state.type === UploadPictureStateType.Uploading}
          isLoading={state.type === UploadPictureStateType.Uploading}>
          {btnText}
        </Button>
      </View>
    </View>
  );
};

export default UploadProfilePicturesModal;

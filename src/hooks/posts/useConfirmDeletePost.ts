import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useDeletePost, { DeletePostOptions } from 'hooks/posts/useDeletePost';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonsLayout } from 'screens/Modals/ConfirmModal';

const useConfirmDeletePost = () => {
  const { t } = useTranslation('createPost');
  const deletePost = useDeletePost();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return useCallback(
    (options: DeletePostOptions) => {
      navigation.navigate(ROUTES.CONFIRM_MODAL, {
        title: t('delete post'),
        subtitle: t('sure to delete'),
        primaryButtonLabel: t('confirm', { ns: 'common' }),
        onPressPrimary: () => deletePost(options),
        secondaryButtonLabel: t('cancel', { ns: 'common' }),
        onPressSecondary: () => null,
        onDismiss: () => null,
        removeModalAfterButtonPress: true,
        buttonsLayout: ButtonsLayout.Row,
        subtitleStyle: { textAlign: 'left' },
      });
    },
    [deletePost, navigation, t],
  );
};

export default useConfirmDeletePost;

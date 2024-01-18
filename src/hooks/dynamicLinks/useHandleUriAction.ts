import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useActiveAccount } from '@recoil/accounts';
import { ToastType } from 'config/toast/toastConfig';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import useLoadingModal from 'hooks/modals/useLoadingModal';
import useNavigateToPost from 'hooks/navigation/useNavigateToPost';
import useToast from 'hooks/toasts/useToast';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import { PostsActionUri, UriAction, UriActions, UriContexts } from 'types/uriActions';

/**
 * Hook that provides a function to handle the UriActions that are related to an event.
 */
const useHandlePostActions = () => {
  const { t } = useTranslation('dynamicLinks');
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount();
  const [getPostById] = useCustomLazyQuery(GetPostByID);
  const { show: showLoadingModal, hide: hideLoadingModal } = useLoadingModal();
  const showToast = useToast();
  const navigateToPostDetails = useNavigateToPost();

  return React.useCallback(
    async (action: PostsActionUri) => {
      if (activeAccount === undefined) {
        let message: string;
        switch (action.action) {
          case UriActions.Show:
            message = t('please login to see the post');
            break;
          default:
            message = t('please login');
            break;
        }
        showToast({
          toastType: ToastType.error,
          title: 'Error',
          message,
        });
        navigation.navigate(ROUTES.LANDING);
        return;
      }

      if (action.action === UriActions.Show) {
        // Show a loading modal that tells the user that we
        // are fetching the event data.
        showLoadingModal({
          title: t('please wait', { ns: 'common' }),
          message: t('retrieving post information', { ns: 'dynamicLinks' }),
        });

        const data = await getPostById({
          variables: {
            postId: action.postId,
          },
        });

        const posts = data?.posts?.map(convertGraphQLPost);

        // Close the loading modal after the request terminates.
        hideLoadingModal();

        if (posts?.at(0) === undefined) {
          showToast({
            toastType: ToastType.error,
            title: t('error', { ns: 'common' }),
            message: t("can't display post"),
          });
        } else {
          navigateToPostDetails(posts[0].id, {
            initialPostData: posts[0],
          });
        }
      }
    },
    [activeAccount, showToast, navigation, t, showLoadingModal, hideLoadingModal],
  );
};

/**
 * Hook that provides a function to handle a {@link GeneralActionUri}.
 */
const useHandleGeneralAction = () => {
  // TODO: implement this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (action: any) => undefined;
};

/**
 * Hook that provides a function to handle a {@link UriAction}.
 */
const useHandleUriAction = () => {
  const handlePostActions = useHandlePostActions();
  const handleGeneralAction = useHandleGeneralAction();

  return React.useCallback(
    (action: UriAction) => {
      switch (action.context) {
        case UriContexts.Posts:
          handlePostActions(action);
          break;
        case UriContexts.General:
          handleGeneralAction(action);
          break;
      }
    },
    [handleGeneralAction, handlePostActions],
  );
};

export default useHandleUriAction;

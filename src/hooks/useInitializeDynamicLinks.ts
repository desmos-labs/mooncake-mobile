import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useEffect} from 'react';
import {Alert} from 'react-native';
import {useSetAppStateValue} from '@recoil/appState';
import {useActiveAccountAddress} from '@recoil/wallets';

/**
 * Hook that allows to properly set up the Firebase Dynamic Links usage.
 */
const useInitializeDynamicLinks = () => {
  const {navigate} =
    useNavigation<StackScreenProps<RootNavigatorParamList>['navigation']>();

  const activeAddress = useActiveAccountAddress();
  const setInviteCode = useSetAppStateValue('inviteCode');

  const handleDynamicLink = (
    link: FirebaseDynamicLinksTypes.DynamicLink | null,
  ) => {
    if (link && !activeAddress) {
      const inviteCode = link.url.substring(link.url.indexOf('=') + 1);
      Alert.alert('You received an invite!', `${inviteCode}`);
      setInviteCode(inviteCode);
      navigate(ROUTES.ONBOARDING, {invited: true});
    } else if (link && activeAddress) {
      Alert.alert('Error', 'Your already have an account');
    }
  };

  useEffect(() => {
    // Listen to Firebase dynamic links, foreground and background modes
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    // Get the initial link, if the app was opened using one
    dynamicLinks().getInitialLink().then(handleDynamicLink);

    // Clear the subscription
    return () => unsubscribe();
  }, []);
};

export default useInitializeDynamicLinks;

import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import inviteCodeState from '@recoil/inviteCodeState';
import useActiveAccount from 'hooks/useActiveAccount';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useEffect} from 'react';
import {Alert} from 'react-native';
import {useSetRecoilState} from 'recoil';

const useDynamicLinks = () => {
  const {navigate} =
    useNavigation<StackScreenProps<RootNavigatorParamList>['navigation']>();
  const {activeAddress} = useActiveAccount();
  const setInviteCode = useSetRecoilState(inviteCodeState);

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    if (link && !activeAddress) {
      const inviteCode = link.url.substring(link.url.indexOf('=') + 1);
      Alert.alert('You received an invite!', `${inviteCode}`);
      setInviteCode(inviteCode);
      navigate(ROUTES.ONBOARDING, {invited: true});
    } else {
      if (link && activeAddress) {
        Alert.alert('Error', 'Your already have an account');
      }
    }
  };

  useEffect(() => {
    // Listen to Firebase dynamic links, foreground and background modes
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && !activeAddress) {
          const inviteCode = link.url.substring(link.url.indexOf('=') + 1);
          Alert.alert('You received an invite!', `${inviteCode}`);
          setInviteCode(inviteCode);
          navigate(ROUTES.ONBOARDING, {invited: true});
        } else {
          if (link && activeAddress) {
            Alert.alert('Error', 'Your already have an account');
          }
        }
      });
    // Clear the subscription
    return () => unsubscribe();
  }, []);
};

export default useDynamicLinks;

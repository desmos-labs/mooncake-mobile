import React from 'react';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import {defaultProfilePic, plusWhiteIcon} from 'assets/images';
import {View} from 'react-native';
import PostTypeTab from 'screens/Home/components/PostTypeTab';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useActiveAccount from 'hooks/useActiveAccount';
import {GrantEnums} from 'lib/desmos/msgtypes';
import ToastConfig from 'config/ToastConfig';
import {useToast} from 'react-native-toast-notifications';
import {useResetRecoilState} from 'recoil';
import sharedPostState from '@recoil/sharedPostState';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import useStyles from './useStyles';

interface Props extends MaterialTopTabBarProps {
  setLoading: (_value: boolean) => void;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

const HomeTabBar = ({state, position, navigation, setLoading}: Props) => {
  const styles = useStyles();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {activeAddress, profileData} = useActiveAccount();
  const toast = useToast();
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();

  const handlePressCreatePost = React.useCallback(async () => {
    if (!activeAddress) return;

    resetSharedPostState();
    setLoading(true);

    const grantsToRequest: GrantEnums[] = [GrantEnums.MsgCreatePost];

    const {success} = await checkAndUpdateGrants({
      grantsToRequest,
    });

    if (success) {
      navigate(ROUTES.CREATE_TEXT_POST);
    } else {
      toast.show('[PLACEHOLDER]Authorization is required.', {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    }
    setLoading(false);
  }, [activeAddress]);

  return (
    <View style={styles.container}>
      <ProfileHeaderButton
        style={styles.profileButton}
        imageSrc={
          profileData?.profile_pic
            ? {uri: profileData?.profile_pic}
            : defaultProfilePic
        }
        onPress={() => {
          navigate(ROUTES.USER_PROFILE);
        }}
      />

      <View style={styles.tabContainer}>
        <PostTypeTab
          state={state}
          position={position}
          navigation={navigation}
        />
      </View>

      <ProfileHeaderButton
        containerStyle={styles.createPostButton}
        style={styles.icon}
        imageSrc={plusWhiteIcon}
        onPress={handlePressCreatePost}
      />
    </View>
  );
};

export default HomeTabBar;

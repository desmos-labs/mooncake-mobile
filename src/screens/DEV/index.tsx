import {useNavigation} from '@react-navigation/native';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import {clearMMKV} from 'lib/MMKVStorage';
import {resetSecureStorage} from 'lib/SecureStorage';
import ROUTES from 'navigation/routes';
import React from 'react';
import {Alert, FlatList, Text, TouchableOpacity} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useAddOrUpdateGrants from 'hooks/authGrants/useAddOrUpdateGrants';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
  ROUTES.CREATE_POST_CAMERA_ROLL,
  ROUTES.SIGNUP,
  ROUTES.ACTION_AUTHORIZATION,
  ROUTES.CREATE_TEXT_POST,
  ROUTES.SELECT_POST_TYPE,
  ROUTES.ENTER_COMMENT,
  ROUTES.ACTION_AUTHORIZATION,
  ROUTES.HOME,
  ROUTES.CONNECT_CHAIN_TX_DETAIL,
  ROUTES.SELECT_CHAIN,
  ROUTES.CONSENT_AGREEMENT,
  ROUTES.SEND_TIPS,
  ROUTES.LOOKING_FOR_DEVICES,
  ROUTES.NO_DTAG_FOUND,
  ROUTES.CONNECT_TO_LEDGER,
  ROUTES.CREATE_DESMOS_PROFILE,
  ROUTES.LANDING,
  ROUTES.WELCOME_BACK,
  ROUTES.CONNECT_ADDRESS_GENERAL,
  ROUTES.CONNECT_ADDRESS_ADVANCED,
  ROUTES.CONFIRM_ADDRESS,
  ROUTES.CONNECT_CHAIN_METHOD,
  ROUTES.DISCONNECT_CHAIN_MODAL,
  ROUTES.POST_DETAILS,
  ROUTES.REPORT_POST,
  ROUTES.FOLLOWING_AND_FOLLOWERS,
  ROUTES.NO_DTAG_FOUND,
];

const DevScreen = () => {
  const {navigate} = useNavigation<any>();
  const {revokeAllGrants} = useAddOrUpdateGrants();
  const toast = useToast();
  /*  const a = [1, 2];
  const b = [1, 2, 3];

  console.log(_.includes(b, a)); */

  const showToast = () => {
    toast.show('I am a toast', {
      type: ToastConfig.SUCCESS,
      onPress() {
        console.log('test');
      },
    });
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          switch (item) {
            case ROUTES.FOLLOWING_AND_FOLLOWERS:
              navigate(item, {
                initialTabRouteName: ROUTES.FOLLOWING,
                subspaceID: 5,
                userAddress: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
                username: '@Raffaello',
              });
              break;
            default:
              navigate(item);
              break;
          }
        }}
        style={{
          padding: 18,
          borderWidth: 1,
          borderColor: 'grey',
        }}>
        <Text style={{color: 'black'}}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={8} />,
    [],
  );

  return (
    <DView>
      <FlatList
        contentContainerStyle={{
          padding: 16,
        }}
        data={routesToRender}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />

      <Button mode="contained" onPress={() => navigate(ROUTES.LANDING)}>
        Continue to Landing screen
      </Button>

      <Spacer paddingVertical={16} />
      <Button mode="contained" onPress={showToast}>
        Show toast
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          Alert.alert(
            'Are you sure?',
            'This will revoke all grants on chain.',
            [
              {
                text: 'Yes',
                onPress: async () => {
                  await revokeAllGrants();
                },
              },
              {
                text: 'Cancel',
              },
            ],
          );
        }}>
        Revoke all Grants
      </Button>

      <Button
        mode="contained"
        onPress={() => {
          Alert.alert(
            'Are you sure?',
            'This will delete all values in MMKV and Secure Storage',
            [
              {
                text: 'Yes',
                onPress: async () => {
                  clearMMKV();
                  await resetSecureStorage();
                },
              },
              {
                text: 'Cancel',
              },
            ],
          );
        }}>
        Reset MMKV storage & Secure Storage
      </Button>
    </DView>
  );
};

export default DevScreen;

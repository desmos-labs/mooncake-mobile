import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import ToastConfig from 'config/ToastConfig';
import { clearMMKV } from 'lib/MMKVStorage';
import { resetSecureStorage } from 'lib/SecureStorage';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { FC, useCallback } from 'react';
import { Alert, FlatList, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import AcceptInvite from 'services/axios/requests/AcceptInvite';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
  ROUTES.MNEMONIC_INPUT,
  // ROUTES.ACTIVITIES,
  // ROUTES.ONBOARDING,
  // ROUTES.LOGIN,
  // ROUTES.USER_PROFILE,
  // ROUTES.SIGNUP_RESULT,
  // ROUTES.CONFIRM_MODAL,
  // ROUTES.SIGNUP,
  // ROUTES.ACTION_AUTHORIZATION,
  // ROUTES.CREATE_TEXT_POST,
  // ROUTES.SELECT_POST_TYPE,
  // ROUTES.ENTER_COMMENT,
  // ROUTES.ACTION_AUTHORIZATION,
  // ROUTES.HOME_TABS,
  // ROUTES.CONNECT_CHAIN_TX_DETAIL,
  // ROUTES.SELECT_CHAIN,
  // ROUTES.CONSENT_AGREEMENT,
  // ROUTES.SEND_TIPS,
  // ROUTES.LOOKING_FOR_DEVICES,
  // ROUTES.NO_DTAG_FOUND,
  // ROUTES.CONNECT_TO_LEDGER,
  // ROUTES.SAVE_PROFILE,
  ROUTES.LANDING,
  // ROUTES.WELCOME_BACK,
  // ROUTES.CONNECT_ADDRESS_GENERAL,
  // ROUTES.CONNECT_ADDRESS_ADVANCED,
  // ROUTES.CONFIRM_ADDRESS,
  // ROUTES.CONNECT_CHAIN_METHOD,
  // ROUTES.DISCONNECT_CHAIN_MODAL,
  // ROUTES.POST_DETAILS,
  // ROUTES.REPORT_POST,
  // ROUTES.FOLLOWING_AND_FOLLOWERS,
  // ROUTES.NO_DTAG_FOUND,
  // ROUTES.ADD_PROFILE,
  ROUTES.SETTINGS,
];

const styles: { [styleName: string]: ViewStyle | TextStyle } = {
  button: { padding: 18, borderWidth: 1, borderColor: 'grey', borderRadius: 12 },
  flatList: { padding: 16 },
  text: { color: 'black' },
};

type DevScreenProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<DevScreenProps> = ({ navigation }) => {
  const { navigate } = navigation;
  const toast = useToast();

  const showToast = () => {
    toast.show('I am a toast', {
      type: ToastConfig.SUCCESS,
      onPress() {
        console.log('test');
      },
    });
    toast.show('I am a toast', {
      type: ToastConfig.ERROR,
      onPress() {
        console.log('test');
      },
    });
    toast.show('I am a toast', {
      type: ToastConfig.ERROR_NO_RETRY,
      onPress() {
        console.log('test');
      },
    });
  };

  const acceptInvite = useCallback(async (code: string) => {
    const result = await AcceptInvite(code);
    if (result.isErr()) {
      Alert.alert('Accept invite error', result.error.message);
    } else {
      Alert.alert('Accept invite tx hash', result.value.txHash);
    }
  }, []);

  const redeemAnInvite = useCallback(async () => {
    Alert.prompt('Insert invite code', '', async invite => {
      await acceptInvite(invite).catch(e => {
        Alert.alert('Error', e.response.data);
      });
    });
  }, [acceptInvite]);

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          switch (item) {
            case ROUTES.FOLLOWING_AND_FOLLOWERS:
              navigate(item, {
                headerTitle: '@Raffaello',
                initialTabRouteName: ROUTES.FOLLOWING,
                subspaceID: 5,
                userAddress: '',
                username: '@Raffaello',
              });
              break;
            case ROUTES.ADD_PROFILE:
              navigate(item);
              break;
            default:
              navigate(item);
              break;
          }
        }}
        style={styles.button}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorComponent = React.useCallback(() => <Spacer paddingVertical={8} />, []);

  return (
    <DView>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.flatList}
        data={routesToRender}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <Spacer paddingVertical={4} />
      <View style={{ marginHorizontal: 10 }}>
        <Button mode="contained" color="green" onPress={() => navigate(ROUTES.LANDING)}>
          Continue to Landing screen
        </Button>
        <Spacer paddingVertical={4} />
        <Button
          mode="contained"
          color="red"
          onPress={() =>
            navigate(ROUTES.BOTTOM_TABS, {
              screen: ROUTES.HOME_TABS,
              params: {
                HOME_DISCOVER: {
                  type: 'discover',
                },
                HOME_FOLLOWING: {
                  type: 'following',
                },
              },
            })
          }>
          Continue to Home screen
        </Button>
        <Spacer paddingVertical={8} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', flex: 0.5 }}>
            <Button mode="contained" onPress={showToast}>
              Show toast
            </Button>
            <Spacer paddingVertical={4} />
            <Button mode="contained" onPress={redeemAnInvite}>
              Accept invite
            </Button>
          </View>
          <Spacer paddingHorizontal={4} />
          <View style={{ flexDirection: 'column', flex: 0.5 }}>
            <Button
              mode="contained"
              onPress={() => {
                Alert.alert('Are you sure?', 'This will revoke all grants on chain.', [
                  {
                    text: 'Yes',
                    onPress: async () => {
                      // await revokeGrants();
                    },
                  },
                  {
                    text: 'Cancel',
                  },
                ]);
              }}>
              Revoke all Grants
            </Button>
            <Spacer paddingVertical={4} />
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
          </View>
        </View>
      </View>
    </DView>
  );
};

export default DevScreen;

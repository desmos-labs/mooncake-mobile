import { StackScreenProps } from '@react-navigation/stack';
import Button, { ButtonMode } from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import { clearMMKV } from 'lib/MMKVStorage';
import { resetSecureStorage } from 'lib/SecureStorage';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { FC, useCallback } from 'react';
import { Alert, FlatList, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import AcceptInvite from 'services/axios/requests/AcceptInvite';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import useCustomToast from 'hooks/extended/useCustomToast';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
  ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT,
  ROUTES.ACTIVITIES,
  ROUTES.ONBOARDING,
  ROUTES.LOGIN,
  ROUTES.PROFILE,
  // ROUTES.SIGNUP_RESULT,
  // ROUTES.CONFIRM_MODAL,
  ROUTES.SIGNUP,
  // ROUTES.ACTION_AUTHORIZATION,
  // ROUTES.SELECT_POST_TYPE,
  // ROUTES.ENTER_COMMENT,
  // ROUTES.ACTION_AUTHORIZATION,
  // ROUTES.HOME_TABS,
  // ROUTES.SELECT_CHAIN,
  // ROUTES.CONSENT_AGREEMENT,
  // ROUTES.SEND_TIPS,
  // ROUTES.CONNECT_TO_LEDGER,
  // ROUTES.SAVE_PROFILE,
  ROUTES.LANDING,
  ROUTES.WELCOME,
  // ROUTES.CONNECT_ADDRESS_GENERAL,
  // ROUTES.CONNECT_ADDRESS_ADVANCED,
  // ROUTES.CONFIRM_ADDRESS,
  // ROUTES.DISCONNECT_CHAIN_MODAL,
  // ROUTES.POST_DETAILS,
  ROUTES.POST_REPORT,
  // ROUTES.FOLLOWING_AND_FOLLOWERS,
  // ROUTES.ADD_PROFILE,
  ROUTES.SETTINGS,
  ROUTES.SETTINGS_INVITES,
];

const styles: { [styleName: string]: ViewStyle | TextStyle } = {
  button: { padding: 18, borderWidth: 1, borderColor: 'grey', borderRadius: 12 },
  flatList: { padding: 16 },
  text: { color: 'black' },
};

type DevScreenProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<DevScreenProps> = ({ navigation }) => {
  const { navigate } = navigation;

  const toast = useCustomToast();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToHome = useNavigateToHome();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const showToast = () => {
    toast.error('hello world', {
      handlePressToast: () => console.log('hello world'),
      handlePressRetry: () => console.log('retry'),
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
            case ROUTES.PROFILE_CONNECTIONS:
              navigate(item, {
                headerTitle: '@Raffaello',
                initialTabRouteName: ROUTES.PROFILE_FOLLOWING,
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
        <Button
          backgroundColor="green"
          textColor="white"
          mode={ButtonMode.CONTAINED}
          size={44}
          onPress={() => navigate(ROUTES.LANDING)}>
          Continue to Landing screen
        </Button>
        <Spacer paddingVertical={4} />
        <Button
          backgroundColor="orange"
          textColor="white"
          mode={ButtonMode.CONTAINED}
          size={44}
          onPress={() => navigateToHome(ROUTES.HOME_TAB_DISCOVER)}>
          Continue to Home screen
        </Button>
        <Spacer paddingVertical={8} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', flex: 0.5 }}>
            <Button onPress={showToast} mode={ButtonMode.OUTLINED} size={32}>
              Show toast
            </Button>
            <Spacer paddingVertical={4} />
            <Button onPress={redeemAnInvite} mode={ButtonMode.OUTLINED} size={32}>
              Accept invite
            </Button>
          </View>
          <Spacer paddingHorizontal={4} />
          <View style={{ flexDirection: 'column', flex: 0.5 }}>
            <Button
              mode={ButtonMode.OUTLINED}
              size={32}
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
              mode={ButtonMode.OUTLINED}
              size={32}
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

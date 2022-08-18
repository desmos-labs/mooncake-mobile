import React from 'react';
import {Alert, FlatList, Text, TouchableOpacity} from 'react-native';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import Spacer from 'components/Spacer';
import DView from 'components/DView';
import Button from 'components/Button';
import {clearMMKV, getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import {getAccounts, resetSecureStorage} from 'lib/SecureStorage';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
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
  ROUTES.REPORT_POST,
];

const DevScreen = () => {
  const {navigate} = useNavigation<any>();

  React.useEffect(() => {
    const devAsyncFunction = async () => {
      const activeAccountAddr = getMMKV<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
      const storedAccounts = await getAccounts();

      console.log(activeAccountAddr, storedAccounts);
    };

    devAsyncFunction();
  }, []);

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigate(item);
        }}
        style={{padding: 18, borderWidth: 1, borderColor: 'grey'}}>
        <Text>{item}</Text>
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

      <Button mode="gradientFilled" onPress={() => navigate(ROUTES.LANDING)}>
        Continue to Landing screen
      </Button>

      <Spacer paddingVertical={16} />
      <Button
        mode="gradientFilled"
        onPress={() => {
          Alert.alert(
            'Are you sure?',
            'This will delete all values in secure storage',
            [
              {
                text: 'Yes',
                onPress: () => {
                  resetSecureStorage();
                },
              },
              {
                text: 'Cancel',
              },
            ],
          );
        }}>
        Reset Secure storage
      </Button>

      <Button
        mode="gradientFilled"
        onPress={() => {
          Alert.alert('Are you sure?', 'This will delete all values in MMKV', [
            {
              text: 'Yes',
              onPress: () => {
                clearMMKV();
              },
            },
            {
              text: 'Cancel',
            },
          ]);
        }}>
        Reset MMKV storage
      </Button>
    </DView>
  );
};

export default DevScreen;

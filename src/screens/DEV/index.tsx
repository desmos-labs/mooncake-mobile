import { StackScreenProps } from '@react-navigation/stack';
import TipUserBottomSheet from 'components/BottomSheets/TipUser';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import CommonStyles from 'config/theme/CommonStyles';
import { ToastType } from 'config/toast/toastConfig';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import useToast from 'hooks/toasts/useToast';
import { clearMMKV } from 'lib/MMKVStorage';
import { Box, HStack, VStack } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { FC } from 'react';
import { Alert, FlatList, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
  ROUTES.LANDING,
  ROUTES.ONBOARDING,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
  ROUTES.WELCOME_PAGE,
  ROUTES.FEE_GRANT_WAITING_SCREEN,
  ROUTES.BOTTOM_TABS,
  ROUTES.UNLOCK_WALLET,
  ROUTES.BOTTOM_SHEET,
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

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToHome = useNavigateToHome();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const showToastSuccess = () => {
    toast({
      toastType: ToastType.success,
      title: 'Success',
      message: 'This is a success toast',
    });
  };

  const showToastLoading = () => {
    toast({
      toastType: ToastType.loading,
      message: 'Loading',
    });
  };

  const showToastError = () => {
    toast({
      toastType: ToastType.error,
      title: 'Error',
      message: 'Something went wrong',
    });
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          switch (item) {
            case ROUTES.ONBOARDING:
              navigate(item, {
                passwordManipulationMode:
                  PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE,
              });
              break;
            case ROUTES.WELCOME_PAGE:
              navigate(item, {
                action: 'create',
              });
              break;
            case ROUTES.UNLOCK_WALLET:
              navigate(item, {
                onSuccess: () => {},
              });
              break;
            case ROUTES.BOTTOM_SHEET:
              navigate(ROUTES.BOTTOM_SHEET, {
                component: TipUserBottomSheet,
                props: {
                  text: 'Tip User Bottom Sheet',
                },
              })
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
        style={CommonStyles.flex[1]}
        contentContainerStyle={styles.flatList}
        data={routesToRender}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <Spacer paddingVertical={4} />
      <Box mx="s">
        <Box></Box>
        <Button
          backgroundColor="rgb(0,140,0)"
          textColor="white"
          size={44}
          onPress={() => navigate(ROUTES.LANDING)}>
          Continue to Landing screen
        </Button>
        <Spacer paddingVertical={4} />
        <Button
          backgroundColor="primary"
          textColor="white"
          size={44}
          onPress={() => navigateToHome(ROUTES.HOME_TAB_DISCOVER)}>
          Continue to Home screen
        </Button>
        <Spacer paddingVertical={4} />
        <HStack>
          <VStack flex={0.5}>
            <Button onPress={showToastSuccess} size={32}>
              Show toast success
            </Button>
            <Button onPress={showToastLoading} size={32}>
              Show toast loading
            </Button>
            <Button onPress={showToastError} size={32}>
              Show toast error
            </Button>
          </VStack>
          <Spacer paddingHorizontal={4} />
          <VStack flex={0.5}>
            <Button
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
          </VStack>
        </HStack>
        <Spacer paddingVertical={4} />
      </Box>
    </DView>
  );
};

export default DevScreen;

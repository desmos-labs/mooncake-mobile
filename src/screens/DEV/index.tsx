import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import CommonStyles from 'config/theme/CommonStyles';
import useCustomToast from 'hooks/extended/useCustomToast';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import { clearMMKV } from 'lib/MMKVStorage';
import { Box, HStack, VStack } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { FC } from 'react';
import { Alert, FlatList, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
  ROUTES.ONBOARDING,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
  ROUTES.WELCOME_PAGE,
  ROUTES.FEE_GRANT_WAITING_SCREEN,
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
    // toast.error('hello world', {
    //   handlePressToast: () => console.log('hello world'),
    //   handlePressRetry: () => console.log('retry'),
    // });

    toast.newPost();
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
        <Spacer paddingVertical={8} />
        <HStack>
          <VStack flex={0.5}>
            <Button onPress={showToast} size={32}>
              Show toast
            </Button>
            <Spacer paddingVertical={4} />
          </VStack>
          <Spacer paddingHorizontal={4} />
          <VStack flex={0.5}>
            <Spacer paddingVertical={4} />
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
      </Box>
    </DView>
  );
};

export default DevScreen;

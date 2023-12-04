import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useActiveAccount } from '@recoil/accounts';
import { useSetLoginFlowState } from '@recoil/login';
import { broadcastAnim } from 'assets/animations';
import { butterflyLandingIcon } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import useGetAuthorizationInformation from 'hooks/authorizations/useGetAuthorizationInformation';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import GRANTER_ADDRESS, { hasSaveProfileAllowance } from 'lib/grantsUtils';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { LoginFlowStep } from 'types/login';
import useStyles from './useStyles';

export interface FeeGrantWaitingScreenParams {
  granted?: boolean | undefined;
}

export type NavProps = NativeStackScreenProps<
  RootNavigatorParamList,
  ROUTES.FEE_GRANT_WAITING_SCREEN
>;

const FeeGrantWaitingScreen = () => {
  const activeAccount = useActiveAccount();
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();
  const setLoginFlowState = useSetLoginFlowState();
  // Fee grant hooks
  const [feeGrantReady, setFeeGrantReady] = useState(params?.granted ?? false);
  const { feeGrants, startCheckingFeeGrants, stopCheckingFeeGrants } =
    useGetAuthorizationInformation(activeAccount?.address!);

  // Profile hooks
  const saveProfile = useSaveProfile();

  useEffect(() => {
    console.log('Checking fee grant for', activeAccount);
  }, [activeAccount]);

  // Hook to prevent the user to go back, just allow it in debug if we need
  // to go back.
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!__DEV__ && e.data.action.type !== 'RESET') {
          e.preventDefault();
        }
      }),
    [navigation],
  );

  const createDesmosProfile = useCallback(() => {
    // If there are no errors, navigate to the save profile screen
    saveProfile({
      blockBackAction: true,
      onProfileSaved: async () => {
        setLoginFlowState({
          step: LoginFlowStep.Completed,
        });
        navigation.navigate(ROUTES.WELCOME_PAGE, {
          action: 'create',
        });
      },
      optionalFeeGranter: GRANTER_ADDRESS,
    });
  }, [navigation, saveProfile, setLoginFlowState]);

  const checkFeeGrant = useCallback(async () => {
    startCheckingFeeGrants(1000);
    // Get the authorization information
    // Check if the user already has the fee grants
    // If has the save profile allowance
    console.log(feeGrants);
    if (hasSaveProfileAllowance(feeGrants)) {
      stopCheckingFeeGrants();
      setFeeGrantReady(true);
      setLoginFlowState({
        step: LoginFlowStep.AccountCreated,
        feeGranter: GRANTER_ADDRESS,
      });
    }
  }, [feeGrants, setLoginFlowState, startCheckingFeeGrants, stopCheckingFeeGrants]);

  useEffect(() => {
    if (!params?.granted) {
      checkFeeGrant();
    }
  }, [checkFeeGrant, params]);

  const title = useMemo(() => {
    if (feeGrantReady) {
      return 'We are ready!';
    }
    return 'Please wait, do not close this screen';
  }, [feeGrantReady]);

  const subtitle = useMemo(() => {
    if (feeGrantReady) {
      return 'You can now create your Desmos Profile!';
    }
    return 'We are setting up your account...';
  }, [feeGrantReady]);

  return (
    <DView style={styles.root}>
      <View style={styles.innerContainer}>
        {feeGrantReady ? (
          <Image
            source={butterflyLandingIcon}
            tintColor={theme.colors.primary}
            style={{ width: 180, height: 180 }}
          />
        ) : (
          <ThemedLottieView autoSize autoPlay loop source={broadcastAnim} />
        )}
        <Spacer paddingBottom={80} />
        <Typography.H6 style={CommonStyles.textAlign.center}>{title}</Typography.H6>
        <Spacer paddingBottom={theme.spacing.l} />
        <Typography.Body5 style={styles.subtitle}>{subtitle}</Typography.Body5>
        <Spacer paddingBottom={theme.spacing.xl} />
        <Button onPress={createDesmosProfile} disabled={!feeGrantReady}>
          Create a Desmos Profile
        </Button>
      </View>
    </DView>
  );
};

export default FeeGrantWaitingScreen;

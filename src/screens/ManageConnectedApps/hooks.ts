import React from 'react';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import { MsgUnlinkApplicationEncodeObject, MsgUnlinkApplicationTypeUrl } from '@desmoslabs/desmjs';
import { useActiveAccount } from '@recoil/accounts';
import { isCanceledOperationError } from 'types/error';
import { modalSuccess } from 'assets/images';
import { capitalize } from 'lib/FormatUtils';
import { useTranslation } from 'react-i18next';
import { ApplicationLink } from 'types/desmos';

export const useCreateAppLink = () => {
  // TODO: Implement app link creation logic.
  return React.useCallback(() => {
    console.warn('Implement app link creation logic.');
  }, []);
};

export const useUnlinkApplication = () => {
  const { t } = useTranslation('connectApp');
  const { navigate } = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount()!;
  const broadcastTx = useBroadcastTx();

  const successDisconnection = React.useCallback(
    (appName: string) => {
      navigate(ROUTES.CONFIRM_MODAL, {
        image: modalSuccess,
        title: t('resultModal:success'),
        subtitle: t('resultModal:appDisconnected', {
          appName: capitalize(appName),
        }),
        primaryButtonLabel: t('resultModal:goToProfile') as string,
        onPressPrimary: () => {
          navigate(ROUTES.BOTTOM_TABS, {
            screen: ROUTES.PROFILE,
          });
        },
      });
    },
    [navigate, t],
  );

  const disconnectApplication = React.useCallback(
    async (applicationLink: ApplicationLink) => {
      const msg: MsgUnlinkApplicationEncodeObject = {
        typeUrl: MsgUnlinkApplicationTypeUrl,
        value: {
          application: applicationLink.application,
          username: applicationLink.username,
          signer: activeAccount.address,
        },
      };
      const broadcastTxResult = await broadcastTx([msg], {
        onChain: true,
      });

      if (broadcastTxResult.isOk()) {
        successDisconnection(applicationLink.application);
      } else if (!isCanceledOperationError(broadcastTxResult.error)) {
        console.error('Failed to unlink application', broadcastTxResult.error);
      }
    },
    [activeAccount.address, broadcastTx, successDisconnection],
  );

  return React.useCallback(
    (applicationLink: ApplicationLink) => {
      navigate(ROUTES.DISCONNECT_APP_MODAL, {
        appName: applicationLink.application,
        onConfirmDisconnection: () => disconnectApplication(applicationLink),
      });
    },
    [disconnectApplication, navigate],
  );
};

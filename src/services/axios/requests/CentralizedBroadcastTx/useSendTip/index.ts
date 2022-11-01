import appSettingsState from '@recoil/settings';
import ToastConfig from 'config/ToastConfig';
import {GrantEnums} from 'lib/desmos/msgtypes';
import React, {useCallback} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState} from 'recoil';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import _ from 'lodash';
import {buildPostTipMsg, buildUserTipMsg, numberToPlainCoin} from './utils';

/**
 * Hook that manange tips
 */
const useSendTip = () => {
  const [appSettings] = useRecoilState(appSettingsState);
  const [sendTipLoading, setSendTipLoading] = React.useState(false);
  const toast = useToast();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();

  /**
   * @param {number} amount The amount number
   * @param {string} sender The address of the sender
   * @param {string} receiver (OPTIONAL only if sending tips to an user) The address of the receiver
   * @param {string} message (OPTIONAL) A message to send with the tip (will be stored as a MEMO)
   * @param {number} postId (OPTIONAL only if sending tips to a post) The id of the post
   * */
  const sendTip = useCallback(
    async ({
      amount,
      sender,
      receiver,
      message,
      postId,
    }: {
      amount: number;
      sender: string;
      receiver?: string;
      message?: string;
      postId?: number;
    }) => {
      const denom = _.get(
        appSettings,
        'currentChain.stakeCurrency.coinMinimalDenom',
      );
      const percentage = _.get(
        appSettings.contractsConfig[0],
        'config.service_fee.percentage.value',
      );

      const depCheckMap: {[index: string]: any} = {
        denom,
        percentage,
      };

      // Sanity check just incase one of the dependencies is undefined
      Object.keys(depCheckMap).forEach(x => {
        if (depCheckMap[x] === undefined) {
          throw new Error(`useSendTip: Missing depedency: ${x}`);
        }
      });

      const grantsToRequest: GrantEnums[] = [GrantEnums.MsgExecuteContract];
      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
      });

      if (!success) {
        console.log(toast.show);
        return toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }

      setSendTipLoading(true);
      try {
        const convertedAmount = [numberToPlainCoin(amount, denom)];
        const convertedFee = [
          numberToPlainCoin(amount + amount * percentage * 0.01, denom),
        ];
        let msg;

        if (postId) {
          msg = buildPostTipMsg({
            amount: convertedAmount,
            fee: convertedFee,
            sender,
            postId,
            contractAddress: appSettings.contractsConfig[0].address,
          });
        } else if (receiver) {
          msg = buildUserTipMsg({
            amount: convertedAmount,
            fee: convertedFee,
            sender,
            receiver,
            contractAddress: appSettings.contractsConfig[0].address,
          });
        }

        console.log(msg);

        if (!msg) throw new Error('Invalid tip target');

        const result = await encodeAndBroadcastTx({msgs: [msg], memo: message});

        console.log('useSendTip', result);

        return result;
      } catch (err: any) {
        console.log('useSendTip', String(err));
        throw new Error(err.toString());
      } finally {
        setSendTipLoading(false);
      }
    },
    [appSettings, checkAndUpdateGrants, toast],
  );

  return {sendTip, sendTipLoading};
};

export default useSendTip;

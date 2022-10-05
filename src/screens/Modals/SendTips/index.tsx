import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import {MorpheusApollo2} from '@desmoslabs/desmjs/build/types/chains';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import getAccountBalance from 'services/graphql/queries/GetAccountBalance';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type SendTipsParams = {
  postAuthor: string;
  postId?: number;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const SendTips = () => {
  const {activeAddress} = useActiveAccount();
  const {params} = useRoute<NavProps['route']>();
  const [tipAmount, setTipAmount] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const {t} = useTranslation('sendTips');
  const {refetch, loading, data} = useQuery(getAccountBalance, {
    variables: {address: activeAddress},
  });
  const styles = useStyles();
  const theme = useTheme();
  const {handleSendTip, sendTipLoading, goBack} = useHooks();

  const editable = useMemo(() => {
    return !(loading || data.action_account_balance.coins[0].amount <= 0);
  }, [data, loading]);

  const handlePressSetTip = useCallback(
    (amount: string) => {
      if (amount === tipAmount) {
        setTipAmount('');
      } else {
        setTipAmount(amount);
      }
    },
    [tipAmount],
  );

  useFocusEffect(
    useCallback(() => {
      refetch({address: 'desmos1n39pwnwnsurvh8zcxwaahttmkvqtxqdmyaln7n'});
    }, [data]),
  );

  const handlePressConfirm = React.useCallback(() => {
    handleSendTip({
      amount: parseInt(tipAmount, 10),
      receiver: params.postAuthor,
      sender: activeAddress!,
      postId: params.postId!,
    });
  }, [activeAddress, tipAmount, params.postAuthor]);

  const convertedBalance = useMemo(() => {
    if (data && !loading) {
      return convertCoin(
        data?.action_account_balance?.coins[0],
        6,
        MorpheusApollo2.denomUnits,
      );
    }
  }, [data, loading]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={goBack}
        style={styles.container}>
        {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
        {/* parts of the modal content are pressed */}

        <TouchableOpacity
          activeOpacity={1}
          style={styles.innerContainer}
          onPress={() => Keyboard.dismiss()}>
          <View style={styles.tabIcon} />
          <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
          <Typography.Body6>{t('description')}</Typography.Body6>
          <Spacer paddingBottom={30} />
          <Typography.Subtitle3>{t('subtitle')}</Typography.Subtitle3>
          <Spacer paddingBottom={14} />
          <View style={styles.buttonGroup}>
            <Button
              disabled={!editable}
              mode={tipAmount === '1' ? 'contained' : 'outlined'}
              style={styles.tipButton}
              contentStyle={styles.tipButtonContent}
              onPress={() => handlePressSetTip('1')}>
              <Typography.Subtitle3
                style={{
                  color:
                    tipAmount === '1'
                      ? theme.colors.white
                      : theme.colors.surfaceBlack,
                  textTransform: 'uppercase',
                }}>
                1 DSM
              </Typography.Subtitle3>
            </Button>
            <Button
              disabled={!editable}
              mode={tipAmount === '5' ? 'contained' : 'outlined'}
              style={styles.tipButton}
              contentStyle={styles.tipButtonContent}
              onPress={() => handlePressSetTip('5')}>
              <Typography.Subtitle3
                style={{
                  color:
                    tipAmount === '5'
                      ? theme.colors.white
                      : theme.colors.surfaceBlack,
                  textTransform: 'uppercase',
                }}>
                5 DSM
              </Typography.Subtitle3>
            </Button>
            <Button
              disabled={!editable}
              mode={tipAmount === '10' ? 'contained' : 'outlined'}
              style={styles.tipButton}
              contentStyle={styles.tipButtonContent}
              onPress={() => handlePressSetTip('10')}>
              <Typography.Subtitle3
                style={{
                  color:
                    tipAmount === '10'
                      ? theme.colors.white
                      : theme.colors.surfaceBlack,
                  textTransform: 'uppercase',
                }}>
                10 DSM
              </Typography.Subtitle3>
            </Button>
          </View>
          <Spacer paddingBottom={20} />
          <DTextInput
            editable={editable}
            value={tipAmount}
            onChangeText={text => setTipAmount(text)}
            keyboardType="numeric"
            numberOfLines={1}
            style={styles.textInput}
            placeholder={t('insert amount')}
            rightElement={
              <Typography.Subtitle3 numberOfLines={1}>DSM</Typography.Subtitle3>
            }
          />
          <Spacer paddingBottom={10} />

          {/* when we will have the selected account properties we will show the available balance and disable the buttons accordingly */}
          {loading ? (
            <ActivityIndicator
              style={{left: 0, marginRight: 'auto'}}
              size="small"
              color={theme.colors.butterOrange01}
            />
          ) : (
            <Typography.Body7 style={{color: theme.colors.accentGreen01}}>
              {/* we will need to format accordingly this number */}
              {t('available')} {convertedBalance?.amount}{' '}
              {convertedBalance?.denom.toUpperCase()}
            </Typography.Body7>
          )}

          <Spacer paddingVertical={20}>
            <Typography.Subtitle3>{t('message')}</Typography.Subtitle3>
          </Spacer>
          <DTextInput
            editable={editable}
            inputStyle={styles.messageInput}
            value={message}
            onChangeText={text => setMessage(text)}
            style={styles.textInput}
            multiline
            placeholder={t('message')}
          />
          <Spacer paddingVertical={10}>
            <Typography.Body7
              style={{
                color: theme.colors.surfaceBlack,
                marginVertical: theme.spacing.s,
              }}>
              {t('warning fee')}
            </Typography.Body7>
            <Button
              loading={sendTipLoading}
              mode="contained"
              color={theme.colors.surfaceBlack}
              onPress={handlePressConfirm}
              disabled={tipAmount === ''}>
              {t('common:confirm')}
            </Button>
          </Spacer>
        </TouchableOpacity>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SendTips;

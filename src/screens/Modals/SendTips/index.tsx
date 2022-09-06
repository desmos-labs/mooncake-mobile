import {useQuery} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import {formatNumShorthand} from 'lib/FormatUtils';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import getAccountBalance from 'services/graphql/queries/GetAccountBalance';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const SendTips = () => {
  const {activeAddress} = useActiveAccount();
  const [tipAmount, setTipAmount] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const {t} = useTranslation('sendTips');
  const {refetch, loading, data} = useQuery(getAccountBalance, {
    variables: {address: activeAddress},
  });
  const styles = useStyles();
  const theme = useTheme();

  const {goBack} = useNavigation<NavProps['navigation']>();

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
    }, []),
  );

  const handlePressConfirm = React.useCallback(() => {
    goBack();
    // implementation
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={goBack}
      style={styles.container}>
      {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
      {/* parts of the modal content are pressed */}
      <TouchableOpacity activeOpacity={1} style={styles.innerContainer}>
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
                  tipAmount === '1' ? theme.colors.white : theme.colors.black,
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
                  tipAmount === '5' ? theme.colors.white : theme.colors.black,
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
                  tipAmount === '10' ? theme.colors.white : theme.colors.black,
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
          rightElement={<Typography.Subtitle3>DSM</Typography.Subtitle3>}
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
            {t('available')}{' '}
            {formatNumShorthand(data.action_account_balance.coins[0].amount)}{' '}
            {data.action_account_balance.coins[0].denom.toUpperCase()}
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
        <Spacer paddingVertical={40}>
          <Button
            mode="contained"
            color={theme.colors.surfaceBlack}
            onPress={handlePressConfirm}
            disabled={tipAmount === ''}>
            {t('common:confirm')}
          </Button>
        </Spacer>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SendTips;

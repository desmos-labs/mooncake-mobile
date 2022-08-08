import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {errorImage} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const SendTips = () => {
  const balance = 1; // fetch the balance
  const [tipAmount, setTipAmount] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const {t} = useTranslation('sendTips');
  const styles = useStyles();
  const theme = useTheme();

  const {goBack} = useNavigation<NavProps['navigation']>();

  const handlePressSetTip = React.useCallback(
    (amount: string) => {
      if (amount === tipAmount) {
        setTipAmount('');
      } else {
        setTipAmount(amount);
      }
    },
    [tipAmount],
  );

  const handlePressConfirm = React.useCallback(() => {
    goBack();
    // implementation
  }, []);

  return balance <= 0 ? (
    <TouchableOpacity
      activeOpacity={1}
      onPress={goBack}
      style={styles.container}>
      {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
      {/* parts of the modal content are pressed */}
      <TouchableOpacity activeOpacity={1} style={styles.innerContainer}>
        <View style={styles.tabIcon} />
        <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
        <Typography.Body6 style={styles.centerText}>
          {t('description')}
        </Typography.Body6>
        <Spacer paddingBottom={30} />
        <Image source={errorImage} style={styles.errorImage} />
        <Spacer paddingBottom={20} />
        <Typography.H5 style={styles.centerText}>{t('oops')}</Typography.H5>
        <Spacer paddingBottom={10} />
        <Typography.Body5 style={styles.centerText}>
          {t('no dsm')}
        </Typography.Body5>
        <Spacer paddingBottom={30} />
        <Button mode="text">
          <Typography.H5
            style={{color: theme.colors.desmosOrange01, textTransform: 'none'}}>
            {t('how to buy dsm')}
          </Typography.H5>
        </Button>
        <Spacer paddingBottom={100} />
      </TouchableOpacity>
    </TouchableOpacity>
  ) : (
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
            mode={tipAmount === '1' ? 'gradientFilled' : 'outlined'}
            style={styles.tipButton}
            contentStyle={styles.tipButtonContent}
            onPress={() => handlePressSetTip('1')}>
            <Typography.Subtitle3
              style={{
                color:
                  tipAmount === '1'
                    ? theme.colors.white
                    : theme.colors.desmosOrange01,
                textTransform: 'uppercase',
              }}>
              1 DSM
            </Typography.Subtitle3>
          </Button>
          <Button
            mode={tipAmount === '5' ? 'gradientFilled' : 'outlined'}
            style={styles.tipButton}
            contentStyle={styles.tipButtonContent}
            onPress={() => handlePressSetTip('5')}>
            <Typography.Subtitle3
              style={{
                color:
                  tipAmount === '5'
                    ? theme.colors.white
                    : theme.colors.desmosOrange01,
                textTransform: 'uppercase',
              }}>
              5 DSM
            </Typography.Subtitle3>
          </Button>
          <Button
            mode={tipAmount === '10' ? 'gradientFilled' : 'outlined'}
            style={styles.tipButton}
            contentStyle={styles.tipButtonContent}
            onPress={() => handlePressSetTip('10')}>
            <Typography.Subtitle3
              style={{
                color:
                  tipAmount === '10'
                    ? theme.colors.white
                    : theme.colors.desmosOrange01,
                textTransform: 'uppercase',
              }}>
              10 DSM
            </Typography.Subtitle3>
          </Button>
        </View>
        <Spacer paddingBottom={20} />
        <DTextInput
          value={tipAmount}
          onChangeText={text => setTipAmount(text)}
          keyboardType="numeric"
          numberOfLines={1}
          style={styles.textInput}
          placeholder={t('insert amount')}
          rightElement={<Typography.Subtitle3>DSM</Typography.Subtitle3>}
        />
        <Spacer paddingBottom={10} />
        <Typography.Body7 style={{color: theme.colors.accentGreen01}}>
          {/* when we will have the selected account properties we will show the available balance and disable the buttons accordingly */}
          {t('available')}
        </Typography.Body7>
        <Spacer paddingBottom={20} />
        <Typography.Subtitle3>{t('message')}</Typography.Subtitle3>
        <Spacer paddingBottom={14} />
        <DTextInput
          inputStyle={styles.messageInput}
          value={message}
          onChangeText={text => setMessage(text)}
          style={styles.textInput}
          multiline
          placeholder={t('message')}
        />
        <Spacer paddingVertical={40}>
          <Button
            mode="gradientFilled"
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

import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import Button from 'components/Button';
import CustomRadioGroup, {RadioValue} from 'components/CustomRadioGroup';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import useStyles from './useStyles';

export type ReportPostParams = {
  postId: number;
  subspaceId: number;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.REPORT_POST>;

const ReportPost = () => {
  const [selectedReport, setSelectedReport] = useState({
    value: 'scam',
    index: 0,
  });
  const [message, setMessage] = useState<string>('');
  const {t} = useTranslation('reportPost');
  const styles = useStyles();
  const theme = useTheme();
  const {goBack} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();
  const [{registeredReports}] = useRecoilState(appSettingsState);

  const initialiRadioValues: RadioValue[] = [
    {label: t('spam'), value: 'spam'},
    {label: t('scam'), value: 'scam'},
    {label: t('nudity'), value: 'nudity'},
    {label: t('violence'), value: 'violent'},
    {label: t('others'), value: 'others'},
  ];

  const onSubmit = React.useCallback(() => {
    console.log('report', selectedReport);
    console.log('message', message);
    goBack();
  }, []);

  useEffect(() => {
    console.log(selectedReport);
    console.log(params);
    console.log(registeredReports);
  }, [selectedReport]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          <Spacer paddingBottom={10} />

          <View>
            <CustomRadioGroup
              values={initialiRadioValues}
              selectedValue={selectedReport.index}
              onSelect={(index, value) => setSelectedReport({value, index})}
            />

            <Spacer paddingBottom={theme.spacing.s} />
            <DTextInput
              editable={selectedReport.index === 4}
              inputStyle={styles.messageInput}
              value={message}
              onChangeText={text => setMessage(text)}
              style={styles.textInput}
              multiline
              placeholder={t('message')}
            />
          </View>
          <Spacer paddingVertical={30}>
            <Button
              color={theme.colors.surfaceBlack}
              mode="contained"
              onPress={onSubmit}>
              {t('submit')}
            </Button>
          </Spacer>
        </TouchableOpacity>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ReportPost;

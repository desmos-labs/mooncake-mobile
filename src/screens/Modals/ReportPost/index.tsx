import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import Button from 'components/Button';
import CustomRadioGroup from 'components/CustomRadioGroup';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import useActiveAccount from 'hooks/useActiveAccount';
import {GrantEnums} from 'lib/desmos/msgtypes';
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
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState} from 'recoil';
import useReportPost from 'services/axios/requests/CentralizedBroadcastTx/ReportPost/useReportPost';
import useStyles from './useStyles';

export type ReportPostParams = {
  postId: number;
  subspaceId: number;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.REPORT_POST>;

const ReportPost = () => {
  const [reportReasons, setReportReasons] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');
  const {t} = useTranslation('reportPost');
  const styles = useStyles();
  const theme = useTheme();
  const {goBack} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();
  const [{registeredReports}] = useRecoilState(appSettingsState);
  const {activeAddress} = useActiveAccount();
  const {manageReport, reportPostLoading} = useReportPost();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const toast = useToast();
  const [selectedReport, setSelectedReport] = useState({
    value: registeredReports[0].id,
    index: 0,
  });
  const onSubmit = React.useCallback(async () => {
    await handleSubmitReport(params.postId);
    goBack();
  }, []);

  useEffect(() => {
    const newState: any[] = registeredReports.map(reason => {
      return {
        label: t(reason.description),
        value: reason.id,
      };
    });
    setReportReasons(newState);
  }, [registeredReports]);

  const handleSubmitReport = React.useCallback(
    async (postId: number) => {
      const grantsToRequest: GrantEnums[] = [GrantEnums.MsgCreateReport];
      // check if user has grants first
      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: activeAddress!,
      });

      if (success) {
        await manageReport({
          postId,
          user: activeAddress!,
          reasonsIds: [selectedReport.value],
          message,
        });
      } else {
        toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    },
    [activeAddress],
  );

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
              values={reportReasons}
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
              loading={reportPostLoading}
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

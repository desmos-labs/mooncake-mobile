import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import Button from 'components/Button';
import CustomRadioGroup from 'components/CustomRadioGroup';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {useRecoilState} from 'recoil';
import useModalAnimations from 'screens/Modals/utils/useModalAnimations';
import useReportPost from 'services/axios/requests/CentralizedBroadcastTx/useReportPost';
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
  const [selectedReport, setSelectedReport] = useState({
    value: registeredReports[0].id,
    index: 0,
  });
  const {reportPost, loading} = useReportPost();
  const {panGesture, animatedStyle} = useModalAnimations();

  useEffect(() => {
    const newState: any[] = registeredReports.map(reason => {
      return {
        label: t(reason.title),
        value: reason.id,
      };
    });
    setReportReasons(newState);
  }, [registeredReports]);

  const handleSubmitReport = useCallback(
    async (postId: number) => {
      await reportPost({
        postId,
        message,
        reasonId: selectedReport.value,
      });
    },
    [reportPost, message, selectedReport.value],
  );

  const onSubmit = useCallback(async () => {
    await handleSubmitReport(params.postId);
    goBack();
  }, [handleSubmitReport, params.postId, goBack]);

  return (
    <GestureDetector gesture={panGesture}>
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
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.innerContainer}
              onPress={() => Keyboard.dismiss()}>
              <View style={styles.tabIcon} />
              <Typography.H4 style={styles.headerText}>
                {t('header')}
              </Typography.H4>
              <Spacer paddingBottom={10} />

              <View>
                <CustomRadioGroup
                  values={reportReasons}
                  selectedValue={selectedReport.index}
                  onSelect={(index, value) => setSelectedReport({value, index})}
                />

                <Spacer paddingBottom={theme.spacing.s} />
                <DTextInput
                  editable={true}
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
                  loading={loading}
                  color={theme.colors.surfaceBlack}
                  mode="contained"
                  onPress={onSubmit}>
                  {t('submit')}
                </Button>
              </Spacer>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GestureDetector>
  );
};

export default ReportPost;

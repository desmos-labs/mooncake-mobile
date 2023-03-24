import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Button from 'components/Button';
import CustomRadioGroup, { RadioValue } from 'components/CustomRadioGroup';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTheme } from 'native-base';
import { Post } from 'types/posts';
import { useAppStateValue } from '@recoil/appState';
import useReportPost from 'hooks/reports/useReportPost';
import FastImage from 'react-native-fast-image';
import { reportSuccessIcon } from 'assets/images';
import { isPostAlreadyReportedError } from 'types/error';
import CommonStyles from 'config/theme/CommonStyles';
import StyledSpinner from 'components/StyledSpinner';
import useStyles from './useStyles';

export type ReportPostParams = {
  post: Post;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.POST_REPORT>;

/**
 * Screen that allows to report a post.
 * @constructor
 */
const ReportPost = () => {
  const { t } = useTranslation('reportPost');
  const styles = useStyles();
  const theme = useTheme();

  const { goBack } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { post } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const reportPost = useReportPost(post);
  const subspaceParams = useAppStateValue('subspaceParams');
  const { reportReasons } = subspaceParams;
  const reportingReasons = reportReasons.map(reason => {
    return {
      label: t(reason.title),
      value: reason.id.toString(),
    } as RadioValue;
  });

  // -------------------------------------------------------------------------------------
  // --- Screen state
  // -------------------------------------------------------------------------------------

  const [message, setMessage] = useState<string>('');
  const [successfulReport, setSuccessfulReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState({
    index: 0,
    value: reportReasons[0].id,
  });

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = useCallback(async () => {
    setLoading(true);
    const result = await reportPost(message, [selectedReport.value]);
    setLoading(false);

    if (result.isErr()) {
      if (isPostAlreadyReportedError(result.error)) {
        // TODO: Do something here - Maybe even nothing?
        return;
      }

      // TODO: Do something here -> waiting for design
      console.log('Error while reporting a post', result.error.message);
    } else {
      setSuccessfulReport(true);
    }
  }, [reportPost, message, selectedReport.value]);

  const successfulReportComponent = useMemo(() => {
    return (
      <View style={styles.successfulReport}>
        <FastImage source={reportSuccessIcon} style={styles.reportIcon} />
        <Typography.H4 style={styles.headerText}>{t('thanks for reporting')}</Typography.H4>
        <Spacer paddingBottom={theme.spacing.m} />
        <Typography.Body5 style={styles.reportSuccessText}>
          {t('report success message')}
        </Typography.Body5>
      </View>
    );
  }, [
    styles.headerText,
    styles.reportIcon,
    styles.reportSuccessText,
    styles.successfulReport,
    t,
    theme.spacing.m,
  ]);

  return (
    <KeyboardAvoidingView
      style={CommonStyles.flex[1]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BottomUpModalWrapper goBack={goBack}>
        {successfulReport ? (
          successfulReportComponent
        ) : (
          <>
            <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
            <Spacer paddingBottom={10} />

            <View>
              <CustomRadioGroup
                values={reportingReasons}
                selectedValue={selectedReport.index}
                onSelect={(index, value) =>
                  setSelectedReport({ value: parseInt(value, 10), index })
                }
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
              {loading ? (
                <View style={styles.loadingView}>
                  <StyledSpinner />
                </View>
              ) : (
                <Button
                  size={44}
                  backgroundColor={theme.colors.surfaceBlack}
                  textColor={theme.colors.white}
                  onPress={onSubmit}>
                  {t('submit')}
                </Button>
              )}
            </Spacer>
          </>
        )}
      </BottomUpModalWrapper>
    </KeyboardAvoidingView>
  );
};

export default ReportPost;

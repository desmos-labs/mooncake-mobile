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
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Post } from 'types/posts';
import { useAppStateValue } from '@recoil/appState';
import useReportPost from 'hooks/useReportPost';
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
      // TODO: Do something here
      console.log('Error while reporting a post', result.error.message);
      return;
    }

    goBack();
  }, [reportPost, message, selectedReport.value, goBack]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BottomUpModalWrapper goBack={goBack}>
        <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
        <Spacer paddingBottom={10} />

        <View>
          <CustomRadioGroup
            values={reportingReasons}
            selectedValue={selectedReport.index}
            onSelect={(index, value) => setSelectedReport({ value: parseInt(value, 10), index })}
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
      </BottomUpModalWrapper>
    </KeyboardAvoidingView>
  );
};

export default ReportPost;

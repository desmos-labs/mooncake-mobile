import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ToastConfig from 'config/ToastConfig';
import useAddOrUpdateGrants from 'hooks/authGrants/useAddOrUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useToast} from 'react-native-toast-notifications';
import TextBullet from 'components/TextBullet';
import {verticalScale} from 'react-native-size-matters';
import useStyles from './useStyles';

export type ActionAuthorizationParams = {
  grants: GrantEnums[];
  detailsModal?: {
    title: string;
    body: string;
    bodyStyle?: StyleProp<TextStyle>;
    buttonLabel: string;
  };
  onCancel?: () => void;
  onApprove?: () => void;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ACTION_AUTHORIZATION
>;

const ActionAuthorization = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('authorization');
  const {pop} = useNavigation<NavProps['navigation']>();
  const [loading, setLoading] = React.useState(false);
  const {addOrUpdateGrants} = useAddOrUpdateGrants();
  const toast = useToast();

  const {
    params: {grants, detailsModal, onCancel, onApprove},
  } = useRoute<NavProps['route']>();

  const grantMessage: string[] = React.useMemo(() => {
    return grants.map(x => {
      switch (x) {
        case GrantEnums.MsgCreateReport:
          return t('report');
        case GrantEnums.MsgCreateRelationship:
          return t('follow');
        case GrantEnums.MsgDeleteRelationship:
          return t('unfollow');
        case GrantEnums.MsgCreatePost:
          return t('createPost');
        case GrantEnums.MsgAddReaction:
          return t('addReaction');
        case GrantEnums.MsgRemoveReaction:
          return t('removeReaction');
        case GrantEnums.MsgExecuteContract:
          return t('execute contract');
        case GrantEnums.MsgSaveProfile:
          return t('edit or save profile');
        default:
          return 'unmapped';
      }
    });
  }, [grants]);

  const handleCancel = React.useCallback(() => {
    // run onCancel last
    onCancel && onCancel();
  }, [onCancel]);

  const handleApprove = React.useCallback(async () => {
    setLoading(true);
    try {
      detailsModal && pop();
      await addOrUpdateGrants({grantsToRequest: grants});
      !detailsModal && pop();
      // run onApprove last
      onApprove && onApprove();
    } catch (err: any) {
      toast.show('[PLACEHOLDER]Error authenticating wallet', {
        type: ToastConfig.ERROR_NO_RETRY,
      });
      console.log(err.toString());
    } finally {
      setLoading(false);
    }
  }, [onApprove, grants, addOrUpdateGrants]);

  const bottomUpModal = useMemo(
    () => (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dismissTouchable}
          onPress={handleCancel}
        />
        <View style={styles.innerContainer}>
          <SafeAreaView edges={['bottom']}>
            <View style={styles.bar} />
            <Spacer paddingVertical={theme.spacing.l}>
              <Typography.H4 style={[styles.textStyle, styles.centered]}>
                {t('header')}
              </Typography.H4>
            </Spacer>

            <View
              style={{
                marginLeft: theme.spacing.l,
                marginBottom: verticalScale(50),
              }}>
              <Typography.Body5 style={styles.textStyle}>
                {t('authorization:authorizeToAction')}
              </Typography.Body5>

              <TextBullet textArr={grantMessage} />

              <Typography.Body5 style={styles.textStyle}>
                {t('authorization:onBehalf')}
              </Typography.Body5>
            </View>

            {/* <Image source={authorizationImage} style={styles.imageStyle} /> */}

            <Button
              mode="contained"
              size={44}
              textColor={theme.colors.white}
              backgroundColor={theme.colors.surfaceBlack}
              onPress={handleApprove}
              loading={loading}>
              {t('common:confirm')}
            </Button>

            <Spacer
              paddingTop={theme.spacing.l}
              paddingBottom={theme.spacing.m}>
              <Button
                mode="outlined"
                size={44}
                disabled={loading}
                onPress={handleCancel}>
                {t('common:refuse')}
              </Button>
            </Spacer>

            <Typography.Body7 style={[styles.textStyle, styles.centered]}>
              {t('avoidRepetitiveActions')}
            </Typography.Body7>
          </SafeAreaView>
        </View>
      </View>
    ),
    [grantMessage, handleApprove, handleCancel, loading],
  );

  const middleModal = useMemo(
    () => (
      <View style={styles.modalContainer}>
        {/* invoke dismiss fn or goBack if user presses the background */}
        <TouchableOpacity
          onPress={handleCancel}
          activeOpacity={1}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.innerModalContainer}>
          <Typography.H5 style={{textAlign: 'center'}}>
            {detailsModal?.title}
          </Typography.H5>

          <Typography.Body5 style={[styles.bodyText, detailsModal?.bodyStyle]}>
            <Trans
              i18nKey={detailsModal?.body as string}
              components={[
                <Typography.Subtitle2 style={detailsModal?.bodyStyle} />,
              ]}
            />
          </Typography.Body5>
          <Button
            size={44}
            textColor={theme.colors.white}
            backgroundColor={theme.colors.surfaceBlack}
            additionalStyle={styles.primaryButton}
            mode="contained"
            onPress={handleApprove}>
            {detailsModal?.buttonLabel}
          </Button>
          <Button
            additionalStyle={styles.secondaryButton}
            size={44}
            mode="text"
            onPress={handleCancel}>
            {t('commmon:cancel')}
          </Button>
        </View>
      </View>
    ),
    [detailsModal, handleApprove, handleCancel],
  );

  return detailsModal ? middleModal : bottomUpModal;
};

export default ActionAuthorization;

import React from 'react';
import Typography from 'components/Typography';
import {Image, TouchableOpacity, View} from 'react-native';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import {Trans, useTranslation} from 'react-i18next';
import {authorizationImage} from 'assets/images';
import Button from 'components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useAddOrUpdateGrants from 'hooks/authGrants/useAddOrUpdateGrants';
import useStyles from './useStyles';

export type ActionAuthorizationParams = {
  grants: GrantEnums[];

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

  const {goBack} = useNavigation<NavProps['navigation']>();

  const [loading, setLoading] = React.useState(false);

  const {addOrUpdateGrants} = useAddOrUpdateGrants();

  const {
    params: {grants, onCancel, onApprove},
  } = useRoute<NavProps['route']>();

  const grantMessage = React.useMemo(() => {
    return grants
      .map(x => {
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
            return t('addReactions');
          default:
            return 'unmapped';
        }
      })
      .join(', ');
  }, [grants]);

  const handleCancel = React.useCallback(() => {
    // do cancel things here
    goBack();
    // run onCancel last
    onCancel && onCancel();
  }, [onCancel]);

  const handleApprove = React.useCallback(async () => {
    setLoading(true);
    await addOrUpdateGrants({grantsToRequest: grants});
    setLoading(false);
    goBack();

    // run onApprove last
    onApprove && onApprove();
  }, [onApprove, grants, addOrUpdateGrants]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dismissTouchable}
        onPress={handleCancel}
      />
      <View style={styles.innerContainer}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.bar} />
          <Spacer paddingVertical={theme.spacing.l}>
            <Typography.H4 style={styles.textStyle}>
              {t('header')}
            </Typography.H4>
          </Spacer>

          <Typography.Body5 style={styles.textStyle}>
            <Trans
              i18nKey="authorization:authorizeToAction"
              values={{
                action: grantMessage,
              }}
            />
          </Typography.Body5>

          <Image source={authorizationImage} style={styles.imageStyle} />

          <Button
            mode="contained"
            style={{backgroundColor: theme.colors.surfaceBlack}}
            onPress={handleApprove}
            loading={loading}>
            {t('common:confirm')}
          </Button>

          <Spacer paddingTop={theme.spacing.l} paddingBottom={theme.spacing.m}>
            <Button
              mode="outlined"
              style={{borderColor: theme.colors.surfaceBlack}}
              labelStyle={{color: theme.colors.surfaceBlack}}
              disabled={loading}
              onPress={handleCancel}>
              {t('common:refuse')}
            </Button>
          </Spacer>

          <Typography.Body7 style={styles.textStyle}>
            {t('avoidRepetitiveActions')}
          </Typography.Body7>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default ActionAuthorization;

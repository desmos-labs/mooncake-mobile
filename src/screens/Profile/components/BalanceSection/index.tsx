import {useNavigation} from '@react-navigation/native';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStyles from './useStyles';

const BalanceSection = ({
  address,
  convertedBalance,
  balanceData,
  balanceLoading,
}: {
  address: string;
  convertedBalance: any;
  balanceData: any;
  balanceLoading: boolean;
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const {t} = useTranslation('profile');
  const {navigate} = useNavigation<any>();
  return (
    <View>
      {balanceData && !balanceLoading ? (
        <View style={styles.container}>
          <Typography.Body6>
            {convertedBalance?.balance?.denom.toUpperCase()} {t('balance')}
          </Typography.Body6>
          <Typography.H3
            style={{
              color: theme.colors.surfaceBlack,
            }}>
            {convertedBalance?.balance?.amount}{' '}
            {convertedBalance?.balance?.denom.toUpperCase()}
          </Typography.H3>
          <Typography.Body6 style={{color: theme.colors.midGrey}}>
            $ {convertedBalance?.convertedAmount}
          </Typography.Body6>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate(ROUTES.OPERATIONS, {address})}>
            <Typography.Body6
              style={{
                marginRight: theme.spacing.s,
                color: theme.colors.butterOrange01,
              }}>
              {t('operations')}
            </Typography.Body6>
            <Icon
              name="angle-right"
              color={theme.colors.butterOrange01}
              size={22}
              allowFontScaling
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

export default BalanceSection;

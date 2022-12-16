import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import Typography from 'components/Typography';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import {verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useRecoilValue} from 'recoil';
import useQueries from 'screens/Profile_V2/useQueries';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import useStyles from './useStyles';

const BalanceSection = () => {
  const theme = useTheme();
  const styles = useStyles();
  const {t} = useTranslation('profile');
  const {convertedBalance, balanceData, balanceLoading} = useQueries();
  return (
    <>
      {balanceData && !balanceLoading ? (
        <View
          style={{
            flex: 1,
            paddingVertical: theme.spacing.m,
            height: verticalScale(140),
          }}>
          <Typography.Body6>
            {convertedBalance?.denom.toUpperCase()} {t('balance')}
          </Typography.Body6>
          <Typography.H3
            style={{
              color: theme.colors.surfaceBlack,
            }}>
            {convertedBalance?.amount} {convertedBalance?.denom.toUpperCase()}
          </Typography.H3>
          <Typography.Body6 style={{color: theme.colors.midGrey}}>
            $ 0
          </Typography.Body6>
          <Divider
            style={{
              backgroundColor: theme.colors.surfaceGrey,
              height: 1,
              marginVertical: theme.spacing.m,
            }}
          />
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Typography.Body6
              style={{
                marginRight: theme.spacing.s,
                color: theme.colors.butterOrange01,
              }}>
              {t('transactions')}
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
        <View style={{height: verticalScale(140), justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

export default BalanceSection;

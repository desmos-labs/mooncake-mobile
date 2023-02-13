import { useLazyQuery } from '@apollo/client';
import { convertCoin } from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React, { useEffect, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import getAccountBalance from 'services/graphql/queries/GetTokenPrice';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

type Props = {
  index: number;

  address: string;

  handlePress: () => void;

  isAlreadyLinked?: boolean;
};

const AddressItem = ({ index, address, handlePress, isAlreadyLinked }: Props) => {
  const { t } = useTranslation('connectAddress');
  const [settings] = useRecoilState(appSettingsState);
  const [getBalance, { data, loading }] = useLazyQuery(getAccountBalance, {
    variables: { address },
  });
  const styles = useStyles();

  const theme = useTheme();

  useEffect(() => {
    if (address.includes('desmos')) {
      getBalance();
    }
  }, [address]);

  const balanceData = useMemo(() => {
    if (!data?.action_account_balance) {
      return null;
    } else if (data?.action_account_balance?.coins[0] && !loading) {
      return convertCoin(
        data?.action_account_balance?.coins[0],
        6,
        settings.currentChain.currencies,
      );
    }
  }, [data]);

  const rightElement = React.useMemo(() => {
    if (isAlreadyLinked) {
      return (
        <Typography.Subtitle4 style={[styles.alignRight, styles.linkedAddrStyle]}>
          {t('alreadyLinked')}
        </Typography.Subtitle4>
      );
    } else if (loading) {
      return (
        <ActivityIndicator
          style={styles.alignRight}
          size="small"
          color={theme.colors.surfaceBlack}
        />
      );
    } else if (balanceData) {
      return (
        <Typography.Subtitle4 style={styles.alignRight}>
          {balanceData.amount} {balanceData.denom.toUpperCase()}
        </Typography.Subtitle4>
      );
    } else {
      return undefined;
    }
  }, [isAlreadyLinked, balanceData]);

  return (
    <DropShadowWrapper customColor="rgba(16, 24, 40, 0.01)">
      <TouchableOpacity disabled={isAlreadyLinked} onPress={handlePress} style={styles.container}>
        <View style={styles.innerContainer}>
          <Typography.Body7 style={[styles.indexStyle, isAlreadyLinked && styles.linkedTextStyle]}>
            #{index + 1}
          </Typography.Body7>
          <Spacer paddingLeft={theme.spacing.l}>
            <Typography.Body6
              ellipsizeMode="middle"
              numberOfLines={1}
              style={[
                styles.textStyle,
                styles.addressStyle,
                isAlreadyLinked && styles.linkedTextStyle,
              ]}>
              {address}
            </Typography.Body6>
          </Spacer>
          {rightElement}
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default AddressItem;

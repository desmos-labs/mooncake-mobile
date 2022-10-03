import {useQuery} from '@apollo/client';
import {formatNumShorthand} from 'lib/FormatUtils';
import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import DropShadowWrapper from 'components/DropShadowWrapper';
import getAccountBalance from 'services/graphql/queries/GetAccountBalance';
import useStyles from './useStyles';

type Props = {
  index: number;

  address: string;

  handlePress: () => void;
};

const AddressItem = ({index, address, handlePress}: Props) => {
  const {data, loading} = useQuery(getAccountBalance, {
    variables: {address},
  });
  const styles = useStyles();

  const theme = useTheme();

  const balanceData = useMemo(() => {
    if (!data?.action_account_balance) return null;
    return data?.action_account_balance?.coins[0]?.amount;
  }, [data]);

  return (
    <DropShadowWrapper customColor="rgba(16, 24, 40, 0.01)">
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <View style={styles.innerContainer}>
          <Typography.Body7 style={styles.indexStyle}>
            #{index + 1}
          </Typography.Body7>
          <Spacer paddingLeft={theme.spacing.l}>
            <Typography.Body6
              ellipsizeMode="middle"
              numberOfLines={1}
              style={[styles.textStyle, styles.addressStyle]}>
              {address}
            </Typography.Body6>
          </Spacer>
          {balanceData &&
            (loading ? (
              <ActivityIndicator
                style={styles.alignRight}
                size="small"
                color={theme.colors.butterOrange01}
              />
            ) : (
              <Typography.Subtitle4 style={styles.alignRight}>
                {formatNumShorthand(balanceData)} DSM
              </Typography.Subtitle4>
            ))}
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default AddressItem;

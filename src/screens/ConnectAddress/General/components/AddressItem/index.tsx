import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import DropShadowWrapper from 'components/DropShadowWrapper';
import useStyles from './useStyles';

type Props = {
  index: number;

  address: string;

  handlePress: () => void;
};

const AddressItem = ({index, address, handlePress}: Props) => {
  const styles = useStyles();

  const theme = useTheme();

  return (
    <DropShadowWrapper customColor="#1018280D" disableInnerWrapper>
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
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default AddressItem;

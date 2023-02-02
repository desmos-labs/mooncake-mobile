import { verifiedIcon } from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import { Image, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';

export type Props = {
  /**
   * Text to display
   */
  permissionName: string;
  /**
   * If the permission has been given
   */
  checked: boolean;
};

const PermissionComponent: React.FC<Props> = props => {
  const { permissionName, checked } = props;
  const theme = useTheme();

  return (
    <>
      <View style={{ flexDirection: 'row', paddingVertical: theme.spacing.l }}>
        <Typography.Body6>{permissionName}</Typography.Body6>
        <Image
          source={verifiedIcon}
          style={[
            { width: 18, height: 18, right: 0, marginLeft: 'auto' },
            !checked && { tintColor: theme.colors.lightGrey01 },
          ]}
        />
      </View>
      <Divider />
    </>
  );
};

export default PermissionComponent;

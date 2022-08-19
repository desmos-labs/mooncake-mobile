import Typography from 'components/Typography';
import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import {Divider, Menu, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type Props = {
  anchor: {x: number; y: number} | React.ReactNode;
  visible: boolean;
  closeMenu: () => void;
  menuItems: {icon: ImageSourcePropType; label: string; onPress: () => void}[];
};

const PopupMenu: React.FC<Props> = ({
  anchor,
  visible,
  closeMenu,
  menuItems,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
      {menuItems.map((item, index) => {
        let last = false;
        if (index === menuItems.length - 1) {
          last = true;
        }
        return (
          <>
            <TouchableOpacity style={styles.item}>
              <Image source={item.icon} style={styles.icon} />
              <Typography.Subtitle4>{item.label}</Typography.Subtitle4>
            </TouchableOpacity>
            {!last && (
              <Divider
                style={{
                  borderColor: theme.colors.lightGrey01,
                  borderWidth: 0.5,
                }}
              />
            )}
          </>
        );
      })}
    </Menu>
  );
};

export default PopupMenu;

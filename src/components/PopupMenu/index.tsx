import Typography from 'components/Typography';
import React, {Fragment, useCallback} from 'react';
import {Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import {Divider, Menu} from 'react-native-paper';
import useStyles from './useStyles';

export type Props = {
  anchor: React.ComponentProps<typeof Menu>['anchor'];
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

  const onPressButton = useCallback(
    (item: any) => {
      closeMenu();
      item.onPress();
    },
    [closeMenu],
  );

  return (
    <Menu
      contentStyle={styles.container}
      visible={visible}
      onDismiss={closeMenu}
      anchor={anchor}>
      {menuItems.map((item, index) => {
        const last = index === menuItems.length - 1;
        return (
          <Fragment key={item.label}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => onPressButton(item)}>
              <Image source={item.icon} style={styles.icon} />
              <Typography.Subtitle4>{item.label}</Typography.Subtitle4>
            </TouchableOpacity>
            {!last && <Divider style={styles.divider} />}
          </Fragment>
        );
      })}
    </Menu>
  );
};

export default PopupMenu;

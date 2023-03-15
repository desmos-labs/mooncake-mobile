import Typography from 'components/Typography';
import React, { Fragment, useCallback } from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { Divider, HamburgerIcon, Menu, Pressable } from 'native-base';
import useStyles from './useStyles';

export type Props = {
  anchor: React.ComponentProps<typeof Menu>['anchor'];
  visible: boolean;
  closeMenu: () => void;
  menuItems: { icon: ImageSourcePropType; label: string; onPress: () => void }[];
};

const PopupMenu: React.FC<Props> = ({ anchor, visible, closeMenu, menuItems }) => {
  const styles = useStyles();

  const onPressButton = useCallback(
    (item: any) => {
      closeMenu();
      item.onPress();
    },
    [closeMenu],
  );

  // temporarily stub implementation
  return (
    <Menu
      style={styles.container}
      isOpen={visible}
      onClose={closeMenu}
      trigger={triggerProps => {
        return (
          <Pressable {...triggerProps} opacity={0}>
            <HamburgerIcon />
          </Pressable>
        );
      }}>
      <Text>Stubbed function</Text>
    </Menu>
  );

  return (
    <Menu contentStyle={styles.container} visible={visible} onDismiss={closeMenu} anchor={anchor}>
      {menuItems.map((item, index) => {
        const last = index === menuItems.length - 1;
        return (
          <Fragment key={item.label}>
            <TouchableOpacity
              style={styles.item}
              accessibilityLabel={`${item.label} button`}
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

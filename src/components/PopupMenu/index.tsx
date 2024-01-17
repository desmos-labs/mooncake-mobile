import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { moreBlackIcon } from 'assets/images';
import { Divider, HStack, Menu, Pressable } from 'native-base';
import { InterfaceMenuProps } from 'native-base/src/components/composites/Menu/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageSourcePropType, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ImageStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import useStyles from './useStyles';

interface PopupMenuItem {
  /**
   * The icon of the item.
   */
  icon: ImageSourcePropType;
  /**
   * The label of the item.
   */
  label: string;
  /**
   * What to do when the item is pressed.
   */
  onPress: () => void;
}

interface Props {
  menuItems: (PopupMenuItem | undefined)[];

  /**
   * An optional callback that is called when the menu is opened.
   */
  onMenuOpen?: () => void;

  /**
   * Optionally override the menu icon.
   */
  menuIcon?: ImageSourcePropType;

  /**
   * Override menu icon style.
   */
  menuIconStyle?: StyleProp<ImageStyle>;
}

/**
 * A floating context menu that provides additional options to the user once opened.
 * @constructor
 */
const PopupMenu: React.FC<Props> = ({ menuItems, onMenuOpen, menuIcon, menuIconStyle }) => {
  const styles = useStyles();

  const { t } = useTranslation('postOperations');

  /**
   * Memoize the menu items to prevent re-renders.
   */
  const menuOptions = React.useMemo(() => {
    return menuItems.map((item, idx) => {
      if (!item) {
        return null;
      }
      return (
        <View key={item.label}>
          <Menu.Item
            _pressed={{
              opacity: 0.5,
              backgroundColor: 'surfaceGray',
            }}
            accessibilityLabel={item.label}
            accessibilityRole="button"
            onPress={item.onPress}>
            <HStack alignItems="center">
              <Image source={item.icon} style={styles.icon} />
              <Typography.Regular14>{item.label}</Typography.Regular14>
            </HStack>
          </Menu.Item>
          {idx !== menuItems.length - 1 && <Divider />}
        </View>
      );
    });
  }, [menuItems, styles.icon]);

  /**
   * Wrap the Menu trigger function in a useCallback.
   */
  const menuTriggerFn = React.useCallback((triggerProps: Pick<InterfaceMenuProps, 'trigger'>) => {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('show post actions')}
        {...triggerProps}>
        <Image source={menuIcon || moreBlackIcon} style={menuIconStyle || styles.menuButton} />
      </Pressable>
    );
    // Can ignore this dependency has the styles will never change after initial render
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  return (
    <Menu
      backgroundColor="white"
      // This is a custom prop added via patch-package to disable an unintended scrolling
      // behavior that occurs on iOS
      // @ts-ignore
      disableScroll
      placement="left top"
      trigger={menuTriggerFn}
      rounded="xl"
      onOpen={onMenuOpen}>
      {menuOptions}
    </Menu>
  );
};

export default PopupMenu;

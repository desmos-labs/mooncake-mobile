import React from 'react';
import Typography from 'components/Typography';
import { Image, ImageSourcePropType } from 'react-native';
import { Box, Divider, HStack, Menu, Pressable } from 'native-base';
import { moreBlackIcon } from 'assets/images';
import { InterfaceMenuProps } from 'native-base/src/components/composites/Menu/types';
import { useTranslation } from 'react-i18next';
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

export interface Props {
  menuItems: (PopupMenuItem | undefined)[];

  /**
   * An optional callback that is called when the menu is opened.
   */
  onMenuOpen?: () => void;
}

/**
 * A floating context menu that provides additional options to the user once opened.
 * @constructor
 */
const PopupMenu: React.FC<Props> = ({ menuItems, onMenuOpen }) => {
  const styles = useStyles();

  const { t } = useTranslation('a11y');

  /**
   * Memoize the menu items to prevent re-renders.
   */
  const menuOptions = React.useMemo(() => {
    return menuItems.map((item, idx) => {
      if (!item) {
        return null;
      }
      return (
        <Box id={item.label} key={item.label}>
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
              <Typography.Subtitle4>{item.label}</Typography.Subtitle4>
            </HStack>
          </Menu.Item>
          {idx !== menuItems.length - 1 && <Divider />}
        </Box>
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
        accessibilityLabel={t('showPostActions')}
        {...triggerProps}>
        <Image source={moreBlackIcon} style={styles.menuButton} />
      </Pressable>
    );
    // Can ignore this dependency has the styles will never change after initial render
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  return (
    <Menu
      backgroundColor="white"
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

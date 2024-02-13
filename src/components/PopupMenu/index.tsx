import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { makeStyle } from 'config/theme';
import React from 'react';
import { Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

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
  popupMenuOpened: boolean;
  setPopupMenuOpened: (opened: boolean) => void;
  menuItems: (PopupMenuItem | undefined)[];
}

/**
 * A floating context menu that provides additional options to the user once opened.
 * @constructor
 */
const PopupMenu: React.FC<Props> = ({ popupMenuOpened, setPopupMenuOpened, menuItems }) => {
  const styles = useStyles();

  /**
   * Memoize the menu items to prevent re-renders.
   */
  const menuOptions = React.useMemo(() => {
    return menuItems.map((item, idx) => {
      if (!item) {
        return null;
      }

      const onSelectItem = () => {
        setPopupMenuOpened(false);
        item.onPress();
      };

      return (
        <MenuOption
          value={idx}
          style={styles.menuOptionWithDivider}
          onSelect={onSelectItem}
          key={menuItems[idx]?.label}>
          <View style={styles.optionView} key={menuItems[idx]?.label}>
            <Image source={item.icon} style={styles.icon} />
            <Typography.Regular14>{item.label}</Typography.Regular14>
          </View>
        </MenuOption>
      );
    });
  }, [menuItems, styles.icon]);

  return (
    <Menu
      opened={popupMenuOpened}
      onBackdropPress={() => setPopupMenuOpened(false)}
      style={styles.popupMenu}>
      <MenuTrigger />
      <MenuOptions
        customStyles={{
          optionsContainer: styles.optionsContainer,
          OptionTouchableComponent: TouchableOpacity,
        }}>
        {menuOptions}
      </MenuOptions>
    </Menu>
  );
};

const useStyles = makeStyle(theme => ({
  popupMenu: { alignSelf: 'flex-end' },
  optionsContainer: {
    width: 150,
    borderRadius: 8,
    borderWidth: 0,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.black,
    marginRight: theme.spacings.s,
  },
  menuOptionWithDivider: {
    borderTopColor: theme.colors.surface,
    borderTopWidth: 1,
  },
  optionView: { flexDirection: 'row', padding: 6, alignItems: 'center' },
}));

export default PopupMenu;

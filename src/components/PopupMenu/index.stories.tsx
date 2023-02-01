import {storiesOf} from '@storybook/react-native';
import Button from 'components/Button';
import React from 'react';
import {View} from 'react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {iconCrossBlack} from 'assets/images';
import PopupMenu from './index';

const RenderComponent = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <View>
      <Button size={26} mode="text" onPress={openMenu}>
        open menu
      </Button>
      <PopupMenu
        anchor={{x: 100, y: 100}}
        visible={menuOpen}
        closeMenu={closeMenu}
        menuItems={[
          {
            label: 'test1',
            onPress: () => console.log('test'),
            icon: iconCrossBlack,
          },
          {
            label: 'test1',
            onPress: () => console.log('test'),
            icon: iconCrossBlack,
          },
          {
            label: 'test1',
            onPress: () => console.log('test'),
            icon: iconCrossBlack,
          },
        ]}
      />
    </View>
  );
};

storiesOf('components/PopupMenu', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <RenderComponent />);

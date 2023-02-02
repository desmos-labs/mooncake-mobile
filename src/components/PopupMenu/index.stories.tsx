import { storiesOf } from '@storybook/react-native';
import { moreIcon } from 'assets/images';
import Button from 'components/Button';
import React from 'react';
import { View } from 'react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import PopupMenu from './index';

const RenderComponent = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <View>
      <Button mode="text" onPress={openMenu}>
        open menu
      </Button>
      <PopupMenu
        anchor={{ x: 100, y: 100 }}
        visible={menuOpen}
        closeMenu={closeMenu}
        menuItems={[
          { label: 'test1', onPress: () => console.log('test'), icon: moreIcon },
          { label: 'test1', onPress: () => console.log('test'), icon: moreIcon },
          { label: 'test1', onPress: () => console.log('test'), icon: moreIcon },
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

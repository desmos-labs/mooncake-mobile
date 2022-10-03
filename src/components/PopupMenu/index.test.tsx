import React from 'react';
import {render} from 'jest/utils/CustomRender';
import PopupMenu from 'components/PopupMenu/index';
import {defaultProfilePic} from 'assets/images';

describe('component: PopupMenu', () => {
  it('renders', () => {
    const tree = render(
      <PopupMenu
        anchor={{x: 0, y: 0}}
        visible
        closeMenu={jest.fn()}
        menuItems={[
          {
            icon: defaultProfilePic,
            label: 'test',
            onPress: jest.fn(),
          },
        ]}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  /**
   * [Kevin]
   * Can't write tests for the menu buttons due to this issue:
   * https://github.com/callstack/react-native-paper/issues/3101
   *
   * A possible solution is to mock the entire Menu.Item component, but I think that would affect
   * the integrity of the tests
   */
});

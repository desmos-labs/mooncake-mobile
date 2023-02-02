import React from 'react';
import { render } from 'jest/utils/CustomRender';
import MnemonicGrid from 'components/MnemonicGrid/index';

describe('component: MnemonicGrid', () => {
  it('renders', () => {
    const tree = render(
      <MnemonicGrid mnemonic="drill rather remain skill online food pool prevent penalty cry cable title fragile flip remind famous dismiss island erase crash column service minute mushroom" />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

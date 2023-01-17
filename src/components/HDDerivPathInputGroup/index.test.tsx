import React from 'react';
import {render} from 'jest/utils/CustomRender';
import HDDerivPathInputGroup from 'components/HDDerivPathInputGroup/index';

describe('component: HDDerivPathInputGroup', () => {
  it('renders', () => {
    const t = render(
      <HDDerivPathInputGroup
        coin={1}
        values={{test: 1}}
        handleChangeAccount={jest.fn()}
        handleChangeChange={jest.fn()}
        handleChangeAddress={jest.fn()}
      />,
    ).toJSON();

    expect(t).toMatchSnapshot();
  });
});

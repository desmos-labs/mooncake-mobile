import React from 'react';
import {render} from 'jest/utils/CustomRender';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper/index';

describe('component: BottomUpModalWrapper', () => {
  it('renders', () => {
    const t = render(<BottomUpModalWrapper goBack={jest.fn()} />).toJSON();

    expect(t).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import TextBullet from 'components/TextBullet/index';

describe('component/TextBullet', function () {
  it('renders', () => {
    const t = render(<TextBullet textArr={['hello', 'world']} />).toJSON();

    expect(t).toMatchSnapshot();
  });
});

import React from 'react';
import {render} from 'jest/utils/CustomWrappers';
import ImageButton from 'components/ImageButton/index';
import {defaultProfilePic} from 'assets/images';

describe('component: ImageButton', () => {
  it('renders', () => {
    const tree = render(<ImageButton image={defaultProfilePic} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

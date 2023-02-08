import React from 'react';
import {render} from 'jest/utils/CustomWrappers';
import ProfileHeaderButton from 'components/ProfileHeaderButton/index';
import {defaultProfilePic} from 'assets/images';

describe('component: ProfileHeaderButton', () => {
  it('renders', () => {
    const tree = render(
      <ProfileHeaderButton imageSrc={defaultProfilePic} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

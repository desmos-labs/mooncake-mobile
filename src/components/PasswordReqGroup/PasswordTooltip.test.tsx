import React from 'react';
import {render} from 'jest/utils/CustomWrappers';
import PasswordTooltip from 'components/PasswordReqGroup/PasswordTooltip';

describe('component: PasswordTooltop', () => {
  it('renders', () => {
    const tree = render(<PasswordTooltip label="label" isSatisfied />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders not satisfied style', () => {
    const tree = render(
      <PasswordTooltip label="label" isSatisfied={false} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

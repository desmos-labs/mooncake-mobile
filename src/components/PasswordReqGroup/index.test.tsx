import React from 'react';
import { render } from 'jest/utils/CustomRender';
import PasswordReqGroup from 'components/PasswordReqGroup/index';

describe('component: PasswordReqGroup', () => {
  it('renders', () => {
    const tree = render(<PasswordReqGroup passwordToCheck="helloWorld123" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

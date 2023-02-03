import React from 'react';
import {render} from 'jest/utils/CustomRender';
import Button, {ButtonMode} from 'components/Button/index';

describe('component: Button', () => {
  it('renders button text mode color white size 26', () => {
    const tree = render(
      <Button mode={ButtonMode.TEXT} backgroundColor="white" size={26} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders button contained mode color white size 32', () => {
    const tree = render(
      <Button mode={ButtonMode.CONTAINED} backgroundColor="white" size={32} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders button outlined mode color white size 44', () => {
    const tree = render(
      <Button mode={ButtonMode.OUTLINED} backgroundColor="white" size={44} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders button text contained color white size 56', () => {
    const tree = render(
      <Button mode={ButtonMode.CONTAINED} backgroundColor="white" size={56} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders button text mode color white size 56', () => {
    const tree = render(
      <Button mode={ButtonMode.TEXT} backgroundColor="white" size={56} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

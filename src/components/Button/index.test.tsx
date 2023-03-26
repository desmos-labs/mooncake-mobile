import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import Button from 'components/Button/index';

describe('component:Button', () => {
  it('renders size 26', () => {
    const t = render(<Button size={26}>Hello world</Button>).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('renders size 32', () => {
    const t = render(<Button size={32}>Hello world</Button>).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('renders size 44', () => {
    const t = render(<Button size={44}>Hello world</Button>).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('renders size 56', () => {
    const t = render(<Button size={56}>Hello world</Button>).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('renders variant outlined', () => {
    const t = render(<Button variant="outline">Hello world</Button>).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('renders variant link', () => {
    const t = render(<Button variant="link">Hello world</Button>).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('renders textColor from props', () => {
    const { getByText } = render(<Button textColor="#FEB123">Hello world</Button>);

    const textComponent = getByText('Hello world');

    expect(textComponent).toHaveStyle({
      color: '#FEB123',
    });
  });

  it('renders background color from props', () => {
    const { getByRole } = render(<Button backgroundColor="#FEB123">Hello world</Button>);

    const button = getByRole('button');

    expect(button).toHaveStyle({
      backgroundColor: '#FEB123',
    });
  });
});

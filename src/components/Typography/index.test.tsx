import React from 'react';
import { render } from 'jest/utils/CustomRender';
import Typography from 'components/Typography/index';

const testText = 'Hello world';

describe('component: Typography', () => {
  it('renders Display1', () => {
    const tree = render(<Typography.Display1>{testText}</Typography.Display1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Display1', () => {
    const tree = render(<Typography.Display1>{testText}</Typography.Display1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Display2', () => {
    const tree = render(<Typography.Display2>{testText}</Typography.Display2>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Display3', () => {
    const tree = render(<Typography.Display3>{testText}</Typography.Display3>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders H1', () => {
    const tree = render(<Typography.H1>{testText}</Typography.H1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders H2', () => {
    const tree = render(<Typography.H2>{testText}</Typography.H2>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders H3', () => {
    const tree = render(<Typography.H3>{testText}</Typography.H3>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders H4', () => {
    const tree = render(<Typography.H4>{testText}</Typography.H4>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders H5', () => {
    const tree = render(<Typography.H5>{testText}</Typography.H5>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Subtitle1', () => {
    const tree = render(<Typography.Subtitle1>{testText}</Typography.Subtitle1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Subtitle2', () => {
    const tree = render(<Typography.Subtitle2>{testText}</Typography.Subtitle2>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Subtitle3', () => {
    const tree = render(<Typography.Subtitle3>{testText}</Typography.Subtitle3>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Subtitle4', () => {
    const tree = render(<Typography.Subtitle4>{testText}</Typography.Subtitle4>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Body1', () => {
    const tree = render(<Typography.Body1>{testText}</Typography.Body1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Body2', () => {
    const tree = render(<Typography.Body2>{testText}</Typography.Body2>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Body3', () => {
    const tree = render(<Typography.Body3>{testText}</Typography.Body3>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Body4', () => {
    const tree = render(<Typography.Body4>{testText}</Typography.Body4>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Body5', () => {
    const tree = render(<Typography.Body5>{testText}</Typography.Body5>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Body6', () => {
    const tree = render(<Typography.Body6>{testText}</Typography.Body6>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Body7', () => {
    const tree = render(<Typography.Body7>{testText}</Typography.Body7>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Link1', () => {
    const tree = render(<Typography.Link1>{testText}</Typography.Link1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Button1', () => {
    const tree = render(<Typography.Button1>{testText}</Typography.Button1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Button2', () => {
    const tree = render(<Typography.Button2>{testText}</Typography.Button2>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Button3', () => {
    const tree = render(<Typography.Button3>{testText}</Typography.Button3>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Caption1', () => {
    const tree = render(<Typography.Caption1>{testText}</Typography.Caption1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Caption2', () => {
    const tree = render(<Typography.Caption2>{testText}</Typography.Caption2>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Caption3', () => {
    const tree = render(<Typography.Caption3>{testText}</Typography.Caption3>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

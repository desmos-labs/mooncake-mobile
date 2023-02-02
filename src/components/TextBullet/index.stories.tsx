import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import React from 'react';
import TextBullet from 'components/TextBullet/index';

type CompProps = React.ComponentProps<typeof TextBullet>;

const defaultProps: CompProps = {
  textArr: ['hello', 'world', 'hello', 'world'],
};

storiesOf('components/TextBullet', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('Default', () => <TextBullet {...defaultProps} />);

import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import TipItem from './index';

type CompProps = React.ComponentProps<typeof TipItem>;

const defaultProps: CompProps = {
  tipAmount: 1,
  avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
  nickname: 'Shrek',
  dTag: 'SwampyBoi',
  timestamp: '2022-07-03T16:00:40.08408',
};

storiesOf('components/TipItem', module)
  .addDecorator(s => <SbContainer justifyContent="center">{s()}</SbContainer>)
  .add('default', () => <TipItem {...defaultProps} />);

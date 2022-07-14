import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import SocialCounter from './index';

type CompProps = React.ComponentProps<typeof SocialCounter>;

const defaultProps: CompProps = {
  count: 50000,
  label: 'Followers',
};

storiesOf('component/SocialCounter', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <SocialCounter {...defaultProps} />);

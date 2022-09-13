import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import ProfileItem from 'screens/SelectDtag/components/ProfileItem/index';
import {storiesOf} from '@storybook/react-native';
import {action} from '@storybook/addon-actions';

type CompProps = React.ComponentProps<typeof ProfileItem>;

const defaultProps: CompProps = {
  nickname: 'shrek',
  dtag: 'swampyboi',
  avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
  handlePress: action('handlePress'),
};

storiesOf('components/ProfileItem', module)
  .addDecorator(s => (
    <SbContainer padding={8} justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <ProfileItem {...defaultProps} />)
  .add('default profile picture', () => (
    <ProfileItem {...defaultProps} avatar={{uri: '[do-not-modify]'}} />
  ));

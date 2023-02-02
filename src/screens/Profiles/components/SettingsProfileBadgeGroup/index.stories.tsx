import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { action } from '@storybook/addon-actions';
import SettingsProfileBadgeGroup from './index';

type CompProps = React.ComponentProps<typeof SettingsProfileBadgeGroup>;

const SelectedProfile: CompProps = {
  values: [
    {
      nickname: 'Rosalinda',
      dTag: '@rosa',
      profilePicture: {
        uri: 'https://www.pinpng.com/pngs/m/156-1567852_random-image-from-user-mario-boo-animated-gif.png',
      },
      isSelected: true,
    },
    {
      nickname: 'Joe',
      dTag: '@joe',
      profilePicture: {
        uri: 'https://www.pinpng.com/pngs/m/156-1567852_random-image-from-user-mario-boo-animated-gif.png',
      },
      isSelected: false,
    },
  ],
  onSelect: action('onPress'),
};

storiesOf('components/SettingsProfileBadge', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={20} backgroundColor="#E6E6E6">
      {getStories()}
    </SbContainer>
  ))
  .add('Text', () => <SettingsProfileBadgeGroup {...SelectedProfile} />);

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { settingsButton } from 'assets/images';
import { action } from '@storybook/addon-actions';
import { View } from 'react-native';
import ImageButton from './index';

type CompProps = React.ComponentProps<typeof ImageButton>;

const defaultProps: CompProps = {
  image: settingsButton,

  onPress: action('onPress'),
};

const customStyle: CompProps = {
  ...defaultProps,

  style: {
    width: 150,
    height: 100,
    backgroundColor: 'gray',
  },
};

const overlayComponent: CompProps = {
  ...defaultProps,

  overlayComponent: (
    <View
      style={{
        alignSelf: 'flex-end',
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: 'orange',
      }}
    />
  ),
};

storiesOf('components/ImageButton', module)
  .addDecorator(s => (
    <SbContainer alignItems="center" justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <ImageButton {...defaultProps} />)
  .add('custom style', () => <ImageButton {...customStyle} />)
  .add('with overlay component', () => <ImageButton {...overlayComponent} />);

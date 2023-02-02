import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { action } from '@storybook/addon-actions';
import { desmosIcon } from 'assets/images';
import SelectedCommentImage from './index';

type CompProps = React.ComponentProps<typeof SelectedCommentImage>;

const StandardProps: CompProps = {
  handlePress: action('onPress'),

  source: desmosIcon,
};

storiesOf('components/SelectedCommentImage', module)
  .addDecorator(getStories => (
    <SbContainer alignItems="center" justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('SelectedCommentImage', () => <SelectedCommentImage {...StandardProps} />);

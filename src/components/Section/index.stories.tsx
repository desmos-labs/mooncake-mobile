import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import SectionText from 'components/SectionText';
import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import Typography from '../Typography';
import Section from './index';

type CompProps = React.ComponentProps<typeof Section>;

const TypographyPlaceholder = (
  <>
    <Typography.Display1>Display1</Typography.Display1>
    <Typography.Display2>Display2</Typography.Display2>
    <Typography.Display3>Display3</Typography.Display3>
    <Typography.H1>H1</Typography.H1>
    <Typography.H2>H2</Typography.H2>
    <Typography.H3>H3</Typography.H3>
    <Typography.H4>H4</Typography.H4>
    <Typography.Subtitle1>Subtitle1</Typography.Subtitle1>
    <Typography.Subtitle2>Subtitle2</Typography.Subtitle2>
    <Typography.Body1>Body1</Typography.Body1>
    <Typography.Body2>Body2</Typography.Body2>
    <Typography.Button1>Button1</Typography.Button1>
    <Typography.Button2>Button2</Typography.Button2>
    <Typography.Caption1>Caption1</Typography.Caption1>
    <Typography.Caption2>Caption2</Typography.Caption2>
  </>
);

const MixedPlaceholder = (
  <>
    <SectionButton label="Button1" />
    <SectionButton label="Button2" rightIconName="home" />
    <SectionSwitch
      label="Switch1"
      value={true}
      disabled={false}
      onValueChange={() => console.log('valueChange')}
    />
    <SectionSwitch
      label="Switch2"
      value={false}
      disabled={false}
      onValueChange={() => console.log('valueChange')}
    />
    <SectionText label="Left" value="Right" />
  </>
);

const SectionProps: CompProps = {
  title: 'Section title',
  children: TypographyPlaceholder,
};

const SectionWithButtons: CompProps = {
  title: 'Section with nested childrens',
  children: MixedPlaceholder,
};

storiesOf('components/Section', module)
  .addDecorator(getStories => (
    <SbContainer padding={16}>{getStories()}</SbContainer>
  ))
  .add('Section with typography', () => <Section {...SectionProps} />)
  .add('Section with nested childrens', () => (
    <Section {...SectionWithButtons} />
  ));

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
    <Typography.H1>H1</Typography.H1>
    <Typography.H2>H2</Typography.H2>
    <Typography.H4>H4</Typography.H4>
    <Typography.Title>Title</Typography.Title>
    <Typography.Subtitle>Subtitle</Typography.Subtitle>
    <Typography.Subtitle2>Subtitle2</Typography.Subtitle2>
    <Typography.Body>Body</Typography.Body>
    <Typography.Body1>Body1</Typography.Body1>
  </>
);

const MixedPlaceholder = (
  <>
    <SectionButton label="Button1" />
    <SectionButton label="Button2" rightIconName="home" />
    <SectionSwitch label="Switch1" value={true} disabled={false} />
    <SectionSwitch label="Switch2" value={false} disabled={false} />
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

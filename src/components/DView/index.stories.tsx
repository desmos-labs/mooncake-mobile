import React from 'react';
import {storiesOf} from '@storybook/react-native';
import {StyleSheet, View} from 'react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import Typography from '../Typography';
import DView from './index';

type CompProps = React.ComponentProps<typeof DView>;

const Scrollable: CompProps = {
  scrollable: true,
};

const styles = StyleSheet.create({
  topBar: {
    borderWidth: 1,
    flexDirection: 'row',
  },
});

const Topbar = (
  <View style={styles.topBar}>
    <Typography.H1>Topbar</Typography.H1>
    <Typography.H1>Topbar</Typography.H1>
    <Typography.H1>Topbar</Typography.H1>
  </View>
);

const ScrollableAndTop: CompProps = {
  scrollable: true,
  topBar: Topbar,
};

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

storiesOf('components/DView', module)
  .addDecorator(getStories => (
    <SbContainer padding={16}>{getStories()}</SbContainer>
  ))
  .add('Default with placeholder', () => <DView>{TypographyPlaceholder}</DView>)
  .add('Default scrollable with placeholder', () => (
    <DView {...Scrollable}>{TypographyPlaceholder}</DView>
  ))
  .add('Default scrollable with placeholder and topbar', () => (
    <DView {...ScrollableAndTop}>{TypographyPlaceholder}</DView>
  ));

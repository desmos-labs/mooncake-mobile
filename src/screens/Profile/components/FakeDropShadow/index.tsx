import React from 'react';
import {useTheme} from 'react-native-paper';
import {View} from 'react-native';
import DropShadowWrapper from 'components/DropShadowWrapper';
import {addAlphaToHex} from 'config/theme';

const FakeDropShadow = () => {
  const theme = useTheme();

  // Shadow effect for the posts panel
  // negative paddingBottom so the
  // posts can be rendered on top of it, for a more seamless effect
  return (
    <View style={{marginTop: theme.spacing.m, marginBottom: -theme.spacing.s}}>
      <DropShadowWrapper
        customColor={addAlphaToHex(theme.colors.butterOrange01, 0.1)}
        customDistance={20}
        customOverlayColor="rgba(255,107,0,0.1)">
        <View style={{height: 20}} />
      </DropShadowWrapper>
    </View>
  );
};

export default FakeDropShadow;

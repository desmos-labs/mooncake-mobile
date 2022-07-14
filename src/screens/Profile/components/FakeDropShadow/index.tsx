import React from 'react';
import {useTheme} from 'react-native-paper';
import {View} from 'react-native';
import DropShadowWrapper from 'components/DropShadowWrapper';

// add alpha value to a hex color code
const addAlpha = (color: string, opacity: number) => {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};

const FakeDropShadow = () => {
  const theme = useTheme();

  {
    /*
    Shadow effect for the posts panel
    negative paddingBottom so the
    posts can be rendered on top of it, for a more seamless effect
    */
  }
  return (
    <View style={{marginTop: theme.spacing.m, marginBottom: 12}}>
      <DropShadowWrapper
        customColor={addAlpha(theme.colors.primary, 0.1)}
        customOverlayColor="rgba(255,255,255,0.1)">
        <View style={{height: 20}} />
      </DropShadowWrapper>
    </View>
  );
};

export default FakeDropShadow;

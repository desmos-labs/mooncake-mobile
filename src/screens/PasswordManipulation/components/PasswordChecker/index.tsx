import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { makeStyle } from 'config/theme';
import React, { useMemo } from 'react';
import { View } from 'react-native';

interface Props {
  strengthLevel: number;
}

const PasswordChecker = ({ strengthLevel }: Props) => {
  const styles = useStyles();
  const text = useMemo(() => {
    switch (strengthLevel) {
      case 0:
      case 1:
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
    }
  }, [strengthLevel]);

  const textColor = useMemo(() => {
    switch (strengthLevel) {
      case 0:
      case 1:
      case 2:
        return styles.textWeak;
      case 3:
        return styles.textMedium;
      case 4:
        return styles.textStrong;
    }
  }, [strengthLevel, styles.textMedium, styles.textStrong, styles.textWeak]);

  const firstDotColor = useMemo(() => {
    switch (strengthLevel) {
      case 0:
      case 1:
      case 2:
        return styles.dotWeak;
      case 3:
        return styles.dotMedium;
      case 4:
        return styles.dotStrong;
    }
  }, [strengthLevel, styles.dotMedium, styles.dotStrong, styles.dotWeak]);

  const secondDotColor = useMemo(() => {
    switch (strengthLevel) {
      case 0:
      case 1:
      case 2:
        return;
      case 3:
        return styles.dotMedium;
      case 4:
        return styles.dotStrong;
    }
  }, [strengthLevel, styles.dotMedium, styles.dotStrong]);

  const thirdDotColor = useMemo(() => {
    switch (strengthLevel) {
      case 0:
      case 1:
      case 2:
      case 3:
        return;
      case 4:
        return styles.dotStrong;
    }
  }, [strengthLevel, styles.dotStrong]);

  return (
    <View style={styles.root}>
      <View style={[styles.dot, firstDotColor]} />
      <View style={[styles.dot, secondDotColor]} />
      <View style={[styles.dot, styles.extraMargin, thirdDotColor]} />
      <Typography.Regular14 style={textColor}>{text}</Typography.Regular14>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  root: { alignItems: 'center', flexDirection: 'row' },
  dot: {
    height: 4,
    width: 20,
    borderRadius: 4,
    backgroundColor: theme.colors.neutralVariants['600'],
    marginRight: 4,
  },
  extraMargin: {
    marginRight: 8,
  },
  dotWeak: {
    backgroundColor: theme.colors.feedback.error,
  },
  dotMedium: {
    backgroundColor: theme.colors.primary,
  },
  dotStrong: {
    backgroundColor: theme.colors.feedback.success,
  },
  textWeak: {
    color: theme.colors.feedback.error,
  },
  textMedium: {
    color: theme.colors.primary,
  },
  textStrong: {
    color: theme.colors.feedback.success,
  },
}));

export default PasswordChecker;

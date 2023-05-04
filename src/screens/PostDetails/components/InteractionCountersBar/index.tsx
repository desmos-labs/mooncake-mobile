import Typography from 'components/Typography';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Box, Skeleton } from 'native-base';
import { DesmosProfile } from 'types/desmos';
import { getProfilePicture } from 'lib/ProfileUtils';
import useStyles from './useStyles';

type Props = {
  loading: boolean;
  interactionAuthors: DesmosProfile[];
  tipsCounter: number;
  likesCounter: number;
  handlePressCounters: () => void;
};

/**
 * Component that allows to show the number and authors of a post interactions (i.e. reactions, tips).
 * @constructor
 */
const InteractionCountersBar = (props: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('postDetails');

  const { loading, interactionAuthors, tipsCounter, likesCounter, handlePressCounters } = props;

  const calculatedWidth = useMemo(() => {
    switch (interactionAuthors.length) {
      case 0:
        return 0;
      default:
        return 30 + (interactionAuthors.length - 1) * 20;
    }
  }, [interactionAuthors.length]);

  return loading ? (
    <View style={styles.container}>
      <Skeleton h="4" borderRadius="4" />
    </View>
  ) : (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressCounters} style={styles.button}>
        {interactionAuthors[0] && (
          <Box width={calculatedWidth} height="30px">
            {interactionAuthors.map((value, index) => {
              return (
                <FastImage
                  key={value.address}
                  source={getProfilePicture(value)}
                  style={[styles.icon, { transform: [{ translateX: 21 * index }] }]}
                />
              );
            })}
          </Box>
        )}
        <Typography.Button2 style={styles.text}>
          {t('likes and tips', { likesCounter, tipsCounter })}
        </Typography.Button2>
      </TouchableOpacity>
    </View>
  );
};

export default InteractionCountersBar;

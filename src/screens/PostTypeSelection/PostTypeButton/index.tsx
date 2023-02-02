import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { imagePostIcon, textPostIcon } from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import useStyles from './useStyles';

type Props = {
  type: 'text' | 'image';

  handlePress: () => void;
};

const PostTypeButton = ({ type, handlePress }: Props) => {
  const { t } = useTranslation('createPost');
  const styles = useStyles();

  const buttonText = React.useMemo(() => {
    const textMap = {
      text: t('text'),
      image: t('media'),
    };

    return textMap[type];
  }, [type]);

  const buttonImage = React.useMemo(() => {
    const imageMap = {
      text: textPostIcon,
      image: imagePostIcon,
    };

    return imageMap[type];
  }, [type]);

  return (
    <DropShadowWrapper>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Image source={buttonImage} style={styles.buttonImage} />
        <Typography.Subtitle2>{t(buttonText)}</Typography.Subtitle2>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default PostTypeButton;

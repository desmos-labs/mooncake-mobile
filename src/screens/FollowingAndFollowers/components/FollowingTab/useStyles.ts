import {StyleProp, ViewStyle} from 'react-native';

const useStyles = () => {
  const contentContainerStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
  };
  return {contentContainerStyle};
};

export default useStyles;

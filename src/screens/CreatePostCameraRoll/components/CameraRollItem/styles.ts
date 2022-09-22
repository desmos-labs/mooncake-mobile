import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  imageStyle: {
    height: 154,
    // can't think of any other way to have a centered list with equal spacing
    // between items
    marginHorizontal: Dimensions.get('screen').width * 0.005,
    width: Dimensions.get('screen').width * 0.23,
  },
});

export default styles;

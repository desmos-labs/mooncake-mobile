import React from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';

const routesToRender = [ROUTES.CONSENT_AGREEMENT];

const DevScreen = () => {
  const {navigate} = useNavigation();

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigate(item);
        }}
        style={{padding: 18, borderWidth: 1, borderColor: 'grey'}}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{
        padding: 16,
      }}
      data={routesToRender}
      renderItem={renderItem}
    />
  );
};

export default DevScreen;

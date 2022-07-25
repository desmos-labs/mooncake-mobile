import React from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import Spacer from 'components/Spacer';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
  ROUTES.CONSENT_AGREEMENT,
  ROUTES.LOOKING_FOR_DEVICES,
  ROUTES.NO_DTAG_FOUND,
];

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

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={8} />,
    [],
  );

  return (
    <FlatList
      contentContainerStyle={{
        padding: 16,
      }}
      data={routesToRender}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};

export default DevScreen;

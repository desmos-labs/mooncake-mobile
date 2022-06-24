import React from 'react';

import {ColorValue, View} from 'react-native';

interface Props {
    justifyContent?: any;
    alignItems?: any;
    padding?: number;
    backgroundColor?: ColorValue;
}

/**
 * Decorator to selectively align components horizontally, vertically, and apply padding.
 */
const SbContainer: React.FC<Props> = ({backgroundColor, justifyContent, alignItems, padding, children}) => {
    return (
        <View style={{
            flex: 1,
            justifyContent,
            alignItems,
            padding,
            backgroundColor
        }}>
            {children}
        </View>
    )
};

export default SbContainer;
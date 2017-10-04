import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';

const JSONArrow = ({ arrowStyle, expanded, nodeType, onPress, styling }) => (
  <TouchableOpacity onPress={onPress}>
    <View {...styling('arrowContainer', arrowStyle)}>
      <Text {...styling(['arrow', 'arrowSign'], nodeType, expanded, arrowStyle)}>
        {'▶'}
      </Text>
      {arrowStyle === 'double' ?
        <Text {...styling(['arrowSign', 'arrowSignInner'])}>{'▶'}</Text> :
        null}
    </View>
  </TouchableOpacity>
);

JSONArrow.propTypes = {
  arrowStyle: PropTypes.oneOf(['single', 'double']),
  expanded: PropTypes.bool.isRequired,
  nodeType: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  styling: PropTypes.func.isRequired,
};

JSONArrow.defaultProps = {
  arrowStyle: 'single',
};

export default JSONArrow;

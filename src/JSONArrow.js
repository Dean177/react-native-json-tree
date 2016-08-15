import React, { PropTypes } from 'react';
import { Text, View } from 'react-native';

// TODO touchable
const JSONArrow = ({ arrowStyle, expanded, nodeType, onPress, styling }) => (
  <View
    {...styling('arrowContainer', arrowStyle)}
    onPress={onPress}
  >
    <Text {...styling(['arrow', 'arrowSign'], nodeType, expanded, arrowStyle)}>
      {'▶'}
      {arrowStyle === 'double' && <Text {...styling(['arrowSign', 'arrowSignInner'])}>{'▶'}</Text>}
    </Text>
  </View>
);

JSONArrow.propTypes = {
  styling: PropTypes.func.isRequired,
  arrowStyle: PropTypes.oneOf(['single', 'double']),
  expanded: PropTypes.bool.isRequired,
  nodeType: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

JSONArrow.defaultProps = {
  arrowStyle: 'single',
};

export default JSONArrow;

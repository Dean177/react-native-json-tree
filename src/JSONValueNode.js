import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

/**
 * Renders simple values (eg. strings, numbers, booleans, etc)
 */
const JSONValueNode = ({
  nodeType,
  styling,
  labelRenderer,
  keyPath,
  valueRenderer,
  value,
  valueGetter,
}) => (
  <View {...styling('value', nodeType, keyPath)}>
    <Text {...styling(['label', 'valueLabel'], nodeType, keyPath)}>
      {labelRenderer(keyPath, nodeType, false, false)}
    </Text>
    <Text {...styling('valueText', nodeType, keyPath)}>
      {valueRenderer(valueGetter(value), value, ...keyPath)}
    </Text>
  </View>
);

JSONValueNode.propTypes = {
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  labelRenderer: PropTypes.func.isRequired,
  nodeType: PropTypes.string.isRequired,
  styling: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueGetter: PropTypes.func,
  valueRenderer: PropTypes.func.isRequired,
};

JSONValueNode.defaultProps = { valueGetter: value => value };

export default JSONValueNode;

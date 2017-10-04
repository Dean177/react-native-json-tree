import React from 'react';
import PropTypes from 'prop-types';
import JSONNestedNode from './JSONNestedNode';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data) {
  return `${data.length} ${data.length !== 1 ? 'items' : 'item'}`;
}

// Configures <JSONNestedNode> to render an Array
const JSONArrayNode = ({ data, ...props }) =>
  <JSONNestedNode
    {...props}
    createItemString={createItemString}
    data={data}
    expandable={data.length > 0}
    nodeType="Array"
    nodeTypeIndicator="[]"
  />;

JSONArrayNode.propTypes = {
  data: PropTypes.array,
};

export default JSONArrayNode;

import React, { PropTypes } from 'react';
import { Text, View } from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import JSONArrow from './JSONArrow';
import getCollectionEntries from './getCollectionEntries';
import JSONNode from './JSONNode';
import ItemRange from './ItemRange';

/**
 * Renders nested values (eg. objects, arrays, lists, etc.)
 */

function renderChildNodes(props, from, to) {
  const {
    nodeType,
    data,
    collectionLimit,
    circularCache,
    keyPath,
    postprocessValue,
    sortObjectKeys,
  } = props;
  const childNodes = [];

  getCollectionEntries(nodeType, data, sortObjectKeys, collectionLimit, from, to).forEach(entry => {
    if (entry.to) {
      childNodes.push(
        <ItemRange
          {...props}
          key={`ItemRange--${entry.from}-${entry.to}`}
          from={entry.from}
          to={entry.to}
          renderChildNodes={renderChildNodes}
        />
      );
    } else {
      const { key, value } = entry;
      const isCircular = circularCache.indexOf(value) !== -1;

      const node = (
        <JSONNode
          {...props}
          {...{ postprocessValue, collectionLimit }}
          key={`Node--${key}`}
          keyPath={[key, ...keyPath]}
          value={postprocessValue(value)}
          circularCache={[...circularCache, value]}
          isCircular={isCircular}
          hideRoot={false}
        />
      );

      if (node !== false) {
        childNodes.push(node);
      }
    }
  });

  return childNodes;
}

export default class JSONNestedNode extends React.Component {
  static propTypes = {
    getItemString: PropTypes.func.isRequired,
    nodeTypeIndicator: PropTypes.any,
    nodeType: PropTypes.string.isRequired,
    data: PropTypes.any,
    hideRoot: PropTypes.bool.isRequired,
    createItemString: PropTypes.func.isRequired,
    styling: PropTypes.func.isRequired,
    collectionLimit: PropTypes.number,
    keyPath: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    labelRenderer: PropTypes.func.isRequired,
    shouldExpandNode: PropTypes.func,
    level: PropTypes.number.isRequired,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    isCircular: PropTypes.bool,
    expandable: PropTypes.bool,
  };

  static defaultProps = {
    data: [],
    circularCache: [],
    level: 0,
    expandable: true,
  };

  constructor(props) {
    super(props);

    // calculate individual node expansion if necessary
    const expanded = props.shouldExpandNode && !props.isCircular ?
        props.shouldExpandNode(props.keyPath, props.data, props.level) : false;
    this.state = {
      expanded,
      createdChildNodes: false,
    };
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handlePress = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const {
      getItemString,
      nodeTypeIndicator,
      nodeType,
      data,
      hideRoot,
      createItemString,
      styling,
      collectionLimit,
      keyPath,
      labelRenderer,
      expandable,
    } = this.props;
    const expanded = this.state.expanded;
    const renderedChildren = expanded || (hideRoot && this.props.level === 0) ?
      renderChildNodes({ ...this.props, level: this.props.level + 1 }) : null;

    const itemType = (
      <Text {...styling('nestedNodeItemType', expanded)}>
        {nodeTypeIndicator}
      </Text>
    );
    const renderedItemString = getItemString(
      nodeType,
      data,
      itemType,
      createItemString(data, collectionLimit)
    );
    const stylingArgs = [keyPath, nodeType, expanded, expandable];

    return hideRoot ? (
      <View {...styling('rootNode', ...stylingArgs)}>
        <View {...styling('rootNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </View>
      </View>
    ) : (
      <View {...styling('nestedNode', ...stylingArgs)}>
        {expandable &&
          <JSONArrow
            styling={styling}
            nodeType={nodeType}
            expanded={expanded}
            onPress={this.handlePress}
          />
        }
        <Text
          {...styling(['label', 'nestedNodeLabel'], ...stylingArgs)}
          onPress={expandable && this.handlePress}
        >
          {labelRenderer(...stylingArgs)}
        </Text>
        <Text
          {...styling('nestedNodeItemString', ...stylingArgs)}
          onPress={expandable && this.handlePress}
        >
          {renderedItemString}
        </Text>
        <View {...styling('nestedNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </View>
      </View>
    );
  }

}

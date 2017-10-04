import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
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
  const collectionEntries = getCollectionEntries(
    nodeType,
    data,
    sortObjectKeys,
    collectionLimit,
    from,
    to,
  );
  collectionEntries.forEach((entry) => {
    if (entry.to) {
      childNodes.push((
        <ItemRange
          {...props}
          key={`ItemRange--${entry.from}-${entry.to}`}
          from={entry.from}
          to={entry.to}
          renderChildNodes={renderChildNodes}
        />
      ));
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

export default class JSONNestedNode extends React.PureComponent {
  static propTypes = {
    createItemString: PropTypes.func.isRequired,
    collectionLimit: PropTypes.number,
    data: PropTypes.any,
    expandable: PropTypes.bool,
    getItemString: PropTypes.func.isRequired,
    hideRoot: PropTypes.bool.isRequired,
    isCircular: PropTypes.bool,
    keyPath: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])).isRequired,
    labelRenderer: PropTypes.func.isRequired,
    level: PropTypes.number.isRequired,
    nodeType: PropTypes.string.isRequired,
    nodeTypeIndicator: PropTypes.any,
    shouldExpandNode: PropTypes.func,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    styling: PropTypes.func.isRequired,
  };

  static defaultProps = {
    circularCache: [],
    data: [],
    expandable: true,
    level: 0,
  };

  constructor(props) {
    super(props);

    // calculate individual node expansion if necessary
    const expanded =
      props.shouldExpandNode &&
      !props.isCircular &&
      props.shouldExpandNode(props.keyPath, props.data, props.level);

    this.state = {
      createdChildNodes: false,
      expanded,
    };
  }

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
    const { expanded } = this.state;
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
      createItemString(data, collectionLimit),
    );
    const stylingArgs = [keyPath, nodeType, expanded, expandable];

    const onPressItemString = expandable ? this.handlePress : () => {};

    return hideRoot ? (
      <View {...styling('rootNode', ...stylingArgs)}>
        <View {...styling('rootNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </View>
      </View>
    ) : (
      <View {...styling('nestedNode', ...stylingArgs)}>
        <View style={{ flexDirection: 'row' }}>
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
            onPress={onPressItemString}
          >
            {labelRenderer(...stylingArgs)}
          </Text>
          <Text
            {...styling('nestedNodeItemString', ...stylingArgs)}
            onPress={onPressItemString}
          >
            {renderedItemString}
          </Text>
        </View>
        {expanded ?
          <View {...styling('nestedNodeChildren', ...stylingArgs)}>
            {renderedChildren}
          </View> :
          null
        }
      </View>
    );
  }

}

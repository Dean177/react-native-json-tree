import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native'
import JSONArrow from './JSONArrow'
import getCollectionEntries from './getCollectionEntries'
import ItemRange from './ItemRange'
import objType from './objType'

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createObjectItemString(data) {
  const len = Object.getOwnPropertyNames(data).length
  return `${len} ${len !== 1 ? 'keys' : 'key'}`
}

// Configures <JSONNestedNode> to render an Object
export const JSONObjectNode = ({ data, ...props }) => (
  <JSONNestedNode
    {...props}
    createItemString={createObjectItemString}
    data={data}
    expandable={Object.getOwnPropertyNames(data).length > 0}
    nodeType="Object"
    nodeTypeIndicator="{}"
  />
)

JSONObjectNode.propTypes = {
  data: PropTypes.object,
}

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
)

JSONValueNode.propTypes = {
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  labelRenderer: PropTypes.func.isRequired,
  nodeType: PropTypes.string.isRequired,
  styling: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueGetter: PropTypes.func,
  valueRenderer: PropTypes.func.isRequired,
}

JSONValueNode.defaultProps = { valueGetter: (value) => value }


export const JSONNode = ({
  getItemString,
  isCustomNode,
  keyPath,
  labelRenderer,
  styling,
  value,
  valueRenderer,
  ...rest
}) => {
  const nodeType = isCustomNode(value) ? 'Custom' : objType(value)

  const simpleNodeProps = {
    getItemString,
    key: keyPath[0],
    keyPath,
    labelRenderer,
    nodeType,
    styling,
    value,
    valueRenderer,
  }

  const nestedNodeProps = {
    ...rest,
    ...simpleNodeProps,
    data: value,
    isCustomNode,
  }

  switch (nodeType) {
    case 'Object':
    case 'Error':
      return <JSONObjectNode {...nestedNodeProps} />
    case 'Array':
      return <JSONArrayNode {...nestedNodeProps} />
    case 'Iterable':
      return <JSONIterableNode {...nestedNodeProps} />
    case 'String':
      return (
        <JSONValueNode {...simpleNodeProps} valueGetter={(raw) => `"${raw}"`} />
      )
    case 'Number':
      return <JSONValueNode {...simpleNodeProps} />
    case 'Boolean':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={(raw) => (raw ? 'true' : 'false')}
        />
      )
    case 'Date':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={(raw) => raw.toISOString()}
        />
      )
    case 'Null':
      return <JSONValueNode {...simpleNodeProps} valueGetter={() => 'null'} />
    case 'Undefined':
      return (
        <JSONValueNode {...simpleNodeProps} valueGetter={() => 'undefined'} />
      )
    case 'Function':
    case 'Symbol':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={(raw) => raw.toString()}
        />
      )
    case 'Custom':
      return <JSONValueNode {...simpleNodeProps} />
    default:
      return null
  }
}

JSONNode.propTypes = {
  getItemString: PropTypes.func.isRequired,
  isCustomNode: PropTypes.func.isRequired,
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  labelRenderer: PropTypes.func.isRequired,
  styling: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueRenderer: PropTypes.func.isRequired,
}

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
  } = props

  const childNodes = []
  const collectionEntries = getCollectionEntries(
    nodeType,
    data,
    sortObjectKeys,
    collectionLimit,
    from,
    to,
  )
  collectionEntries.forEach((entry) => {
    if (entry.to) {
      childNodes.push(
        <ItemRange
          {...props}
          key={`ItemRange--${entry.from}-${entry.to}`}
          from={entry.from}
          to={entry.to}
          renderChildNodes={renderChildNodes}
        />,
      )
    } else {
      const { key, value } = entry
      const isCircular = circularCache.indexOf(value) !== -1

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
      )

      if (node !== false) {
        childNodes.push(node)
      }
    }
  })

  return childNodes
}

export class JSONNestedNode extends React.PureComponent {
  static propTypes = {
    createItemString: PropTypes.func.isRequired,
    collectionLimit: PropTypes.number,
    data: PropTypes.any,
    expandable: PropTypes.bool,
    getItemString: PropTypes.func.isRequired,
    hideRoot: PropTypes.bool.isRequired,
    isCircular: PropTypes.bool,
    keyPath: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ).isRequired,
    labelRenderer: PropTypes.func.isRequired,
    level: PropTypes.number.isRequired,
    nodeType: PropTypes.string.isRequired,
    nodeTypeIndicator: PropTypes.any,
    shouldExpandNode: PropTypes.func,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    styling: PropTypes.func.isRequired,
  }

  static defaultProps = {
    circularCache: [],
    data: [],
    expandable: true,
    level: 0,
  }

  constructor(props) {
    super(props)

    // calculate individual node expansion if necessary
    const expanded =
      props.shouldExpandNode &&
      !props.isCircular &&
      props.shouldExpandNode(props.keyPath, props.data, props.level)

    this.state = {
      createdChildNodes: false,
      expanded,
    }
  }

  handlePress = () => this.setState({ expanded: !this.state.expanded })

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
    } = this.props
    const { expanded } = this.state
    const renderedChildren =
      expanded || (hideRoot && this.props.level === 0)
        ? renderChildNodes({ ...this.props, level: this.props.level + 1 })
        : null

    const itemType = (
      <Text {...styling('nestedNodeItemType', expanded)}>
        {nodeTypeIndicator}
      </Text>
    )
    const renderedItemString = getItemString(
      nodeType,
      data,
      itemType,
      createItemString(data, collectionLimit),
    )
    const stylingArgs = [keyPath, nodeType, expanded, expandable]

    const onPressItemString = expandable ? this.handlePress : () => {}

    return hideRoot ? (
      <View {...styling('rootNode', ...stylingArgs)}>
        <View {...styling('rootNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </View>
      </View>
    ) : (
      <View {...styling('nestedNode', ...stylingArgs)}>
        <View style={{ flexDirection: 'row' }}>
          {expandable && (
            <JSONArrow
              styling={styling}
              nodeType={nodeType}
              expanded={expanded}
              onPress={this.handlePress}
            />
          )}
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
        {expanded ? (
          <View {...styling('nestedNodeChildren', ...stylingArgs)}>
            {renderedChildren}
          </View>
        ) : null}
      </View>
    )
  }
}


// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createIterableItemString(data, limit) {
  let count = 0
  let hasMore = false
  if (Number.isSafeInteger(data.size)) {
    count = data.size
  } else {
    for (const entry of data) {
      // eslint-disable-line no-unused-vars
      if (limit && count + 1 > limit) {
        hasMore = true
        break
      }
      count += 1
    }
  }
  return `${hasMore ? '>' : ''}${count} ${count !== 1 ? 'entries' : 'entry'}`
}

// Configures <JSONNestedNode> to render an iterable
export function JSONIterableNode({ ...props }) {
  return (
    <JSONNestedNode
      {...props}
      nodeType="Iterable"
      nodeTypeIndicator="()"
      createItemString={createIterableItemString}
    />
  )
}


// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data) {
  return `${data.length} ${data.length !== 1 ? 'items' : 'item'}`;
}

// Configures <JSONNestedNode> to render an Array
export const JSONArrayNode = ({ data, ...props }) =>
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

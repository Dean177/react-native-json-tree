import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import JSONArrow from './JSONArrow';

export default class ItemRange extends Component {
  static propTypes = {
    styling: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    renderChildNodes: PropTypes.func.isRequired,
    nodeType: PropTypes.string.isRequired,
  };

  state = { expanded: false };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handlePress = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const { styling, from, to, renderChildNodes, nodeType } = this.props;

    return (this.state.expanded ?
      <View {...styling('itemRange', this.state.expanded)}>
        {renderChildNodes(this.props, from, to)}
      </View> :
      <View
        {...styling('itemRange', this.state.expanded)}
        onPress={this.handlePress}
      >
        <JSONArrow
          nodeType={nodeType}
          styling={styling}
          expanded={false}
          onPress={this.handlePress}
          arrowStyle="double"
        />
        <Text {...styling('itemRangeText', this.state.expanded)}>>{`${from} ... ${to}`}</Text>
      </View>
    );
  }
}

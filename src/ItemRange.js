import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
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

  shouldComponentUpdate = shouldPureComponentUpdate;

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
        {`${from} ... ${to}`}
      </View>
    );
  }


}

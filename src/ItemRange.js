import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import JSONArrow from './JSONArrow';

export default class ItemRange extends PureComponent {
  static propTypes = {
    styling: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    renderChildNodes: PropTypes.func.isRequired,
    nodeType: PropTypes.string.isRequired,
  };

  state = { expanded: false };

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
        <Text {...styling('itemRangeText', this.state.expanded)}>{`> ${from} ... ${to}`}</Text>
      </View>
    );
  }
}

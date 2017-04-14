import { Map } from 'immutable';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import JSONTree from 'react-native-json-tree';
import Heading from './Heading';

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { margin: 10 },
});

const exampleJson = {
  array: [1, 2, 3],
  emptyArray: [],
  emptyObject: {},
  bool: true,
  date: new Date(),
  smallObject: {
    yes: false,
    zero: 1,
    empty: 'string',
  },
  nestedObject: {
    baz: undefined,
    clazz: function User() {},
    foo: {
      nested: {
        deepValue: 'Hello',
        levels: 2,
        tooMany: true,
        nested: {
          deeper: {
            some: {
              very: 'deep value',
            },
          },
        },
      },
    },
  },
  immutable: Map({ key: 'value' }), // eslint-disable-line new-cap
  hugeArray: Array.from({ length: 100 }).map((_, i) => `item #${i}`),
  longString: 'Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdig',
};


// eslint-disable-next-line
class Examples extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Heading>react-native-json-tree</Heading>
          <JSONTree data={exampleJson} />
        </ScrollView>
      </View>
    );
  }
}

export default Examples;

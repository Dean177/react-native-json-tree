import { Map } from 'immutable';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import JSONTree from 'react-native-json-tree';
import Heading from './Heading';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 20,
  },
});

const exampleJson = {
  array: [1, 2, 3],
  emptyArray: [],
  bool: true,
  date: new Date(),
  object: {
    foo: {
      bar: 'baz',
      nested: {
        moreNested: {
          evenMoreNested: {
            veryNested: {
              insanelyNested: {
                ridiculouslyDeepValue: 'Hello',
                levels: 9,
                tooMany: true,
              },
            },
          },
        },
      },
    },
    baz: undefined,
    func: function User() {},
  },
  emptyObject: {},
  immutable: Map({ key: 'value' }), // eslint-disable-line new-cap
  hugeArray: Array.from({ length: 10000 }).map((_, i) => `item #${i}`),
  longString: 'Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.' // eslint-disable-line max-len
};

// eslint-disable-next-line
class Examples extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Heading>react-native-json-tree</Heading>
        <Text>Sub Text</Text>
        <JSONTree data={exampleJson} />
      </View>
    );
  }
}

export default Examples;

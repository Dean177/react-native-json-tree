import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({ heading: {
  fontSize: 25,
  fontWeight: 'bold',
  marginBottom: 10,
  marginTop: 20,
} });

const Heading = ({ style, ...rest }) =>
  <Text style={styles.heading} {...rest} />;

Heading.propTypes = Text.propTypes;

export default Heading;

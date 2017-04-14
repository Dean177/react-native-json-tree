import { shallow } from 'enzyme';
import React from 'react';
import JSONTree from '../src/index';
import JSONNode from '../src/JSONNode';

describe('JSONTree', () => {
  const BASIC_DATA = { a: 1, b: 'c' };

  it('should render basic tree', () => {
    const result = shallow(<JSONTree data={BASIC_DATA} />);

    expect(result.type).toBe('ul');
    expect(result.props.children.type.name).toBe(JSONNode.name);
  });
});

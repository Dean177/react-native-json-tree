import { Component, ReactNode } from 'react';
import { Theme } from 'react-base16-styling';

declare module 'react-native-json-tree' {

  type Renderable = any[] | string | number | undefined | null | Map<any, any> | Set<any> | boolean | Date | Function | symbol | Record<string | number, unknown>
  export type ObjectType = 'Object' | 'Error' | 'Array' | 'Iterable' | 'String' | 'Number' | 'Boolean' | 'Date' | 'Null' | 'Undefined' | 'Function' | 'Symbol' | 'Custom';
  export interface JSONTreeProps {
    collectionLimit?: number;
    data: Renderable;
    getItemString?: (_type: any, _data: any, itemType: ReactNode, itemString: string | number | undefined) => ReactNode;
    hideRoot?: boolean;
    invertTheme?: boolean;
    isCustomNode?: (value: Renderable) => boolean;
    keyPath?: (string | number)[];
    labelRenderer?: (
      keyPath: string[],
      nodeType?: ObjectType,
      expanded?: boolean,
      expandable?: boolean,
    ) => JSX.Element;
    postprocessValue?: (value: Renderable) => any;
    sortObjectKeys?: boolean | ((a: Renderable, b: Renderable) => number);
    shouldExpandNode?: (_keyName: any, _data: any, level: number) => boolean;
    theme?: Theme;
    valueRenderer?: (value: Renderable | undefined) => ReactNode;
  }

  export default class JSONTree extends Component<JSONTreeProps> {}
}

import React, { Component, Fragment } from 'react';
import TreeNode from './components/TreeNode';

const USER = {
  '1': 'Dave',
  '2': 'Simon',
  '3': 'Anna',
};
const TASK = {
  '1-1': 'clean car',
  '2-1': 'clean house',
  '3-1': 'clean car',
  '3-2': 'clean house',
};
const SUB_TASK = {
  '1-1-1': 'clean wheels',
  '1-1-2': 'clean window',
  '1-1-3': 'clean seats',
  '3-1-1': 'clean wheels',
  '3-1-2': 'clean seats',
  '3-2-1': 'clean window',
};

const FIRST_LVL = ['1', '2', '3'];
const SECOND_LVL = ['1-1', '2-1', '3-1', '3-2'];
const LAST_LVL = ['1-1-1', '1-1-2', '1-1-3', '3-1-1', '3-1-2', '3-2-1'];

class App extends Component {
  render() {
    return (
      <Fragment>
        <TreeNode
          user={USER}
          task={TASK}
          subTask={SUB_TASK}
          firstLvlArray={FIRST_LVL}
          secondLvlArray={SECOND_LVL}
          lastLvlArray={LAST_LVL}
        />
      </Fragment>
    );
  }
}

export default App;

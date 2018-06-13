import React, { Component } from 'react';
import styled from 'styled-components';

import Node from './Node';
import PropTypes from 'prop-types';

const Panel = styled.ul`

`;

const Modal = styled.div`
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
`;

const ModalContent = styled.div`
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
`;

const ModalClose = styled.button`
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
`;

const InputGroup = styled.div`
  height: 54px;
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
  flex: 1;
  margin-bottom: 40px;
`;

const Colors = () => `
  border: 1px solid rgba(114, 118, 124, .3);
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-color: rgba(114, 118, 124, .3);
  display: inline-block;
  height: 54px;
  padding-left: 20px;
`;

const Label = styled.label`
  ${Colors};
  width: 120px;
  line-height: 54px;
  color: rgba(0, 0, 0, .7);
  border-radius: 2px 0 0 2px;
`;

export const Input = styled.input`
  ${Colors};
  color: #000;
  border-radius: 0 2px 2px 0;
  padding-top: 0;
  padding-bottom: 0;
`;

class TreeNode extends Component {
  constructor(props) {
    super();
    this.state = {
      user: props.user,
      task: props.task,
      subTask: props.subTask,
      firstLvlArray: props.firstLvlArray,
      secondLvlArray: props.secondLvlArray,
      lastLvlArray: props.lastLvlArray,
      modalShow: false,
      nodeAdd: {},
    };
  };

  onChangeTask = (e) => this.setState({ taskName: e.target.value });

  modalClose = () => this.setState({ modalShow: false });

  addNewNode = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    const node = this.state.nodeAdd;
    const taskName = this.state.taskName;
    const lvl = node.split('-').length;
    if (lvl === 1) {
      const secondLvlArray = this.state.secondLvlArray;
      const taskObject = this.state.task;
      let calcLvlTask = 0;
      secondLvlArray.forEach(el => {
        if (el.charAt(0) === node) {
          calcLvlTask++;
        }
      });
      const taskId = `${node}-${calcLvlTask + 1}`;
      secondLvlArray.push(taskId);
      taskObject[`${taskId}`] = taskName;
      this.setState({ secondLvlArray, task: taskObject });
    }
    if (lvl === 2) {
      const lastLvlArray = this.state.lastLvlArray;
      const subTaskObject = this.state.subTask;
      let calcLvlTask = 0;
      lastLvlArray.forEach(el => {
        const elLvl = el.split('-');
        const nodeLvl = node.split('-');
        if (elLvl[0] === nodeLvl[0] && elLvl[1] === nodeLvl[1]) {
          calcLvlTask++;
        }
      });
      const subTaskId = `${node}-${calcLvlTask + 1}`;
      lastLvlArray.push(subTaskId);
      subTaskObject[`${subTaskId}`] = taskName;
      this.setState({ lastLvlArray, subTask: subTaskObject });
    }
    this.setState({ modalShow: false, taskName: '' });
    return true;
  };

  removeNode = (e, node, array) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    const NewData = array.slice();
    const lvl = node.split('-').length;
    NewData.splice(NewData.findIndex(el => el === node), 1);
    if (lvl === 1) {
      this.setState({ firstLvlArray: NewData });
    } else if (lvl === 2) {
      this.setState({ secondLvlArray: NewData });
    } else {
      this.setState({ lastLvlArray: NewData });
    }
  };

  replaceList = (dragSource, dropTarget) => {
    const { lastLvlArray, secondLvlArray, firstLvlArray, task, subTask } = this.state;
    const dragSourceLvl = dragSource.split('-').length;
    const dropTargetLvl = dropTarget.split('-').length;
    const userLvlSource = dragSource.match(/^\d*/)[0];
    const userLvlTarget = dropTarget.match(/^\d*/)[0];
    if (dragSourceLvl >= dropTargetLvl) {
      if (dragSourceLvl === 1) {
        let dragSourceIndex = firstLvlArray.findIndex((el) => el === dragSource);
        let dropTargetIndex = firstLvlArray.findIndex((el) => el === dropTarget);
        if (dragSourceIndex === dropTargetIndex) {
          return;
        }
        let newFirstLvlArray = firstLvlArray;
        let removed = newFirstLvlArray.splice(dragSourceIndex, 1, firstLvlArray[dropTargetIndex]);
        newFirstLvlArray.splice(dropTargetIndex, 1, removed[0]);
        this.setState({ firstLvlArray: newFirstLvlArray });
      }
      if (dragSourceLvl === 2) {
        if (userLvlSource === dropTarget) {
          return;
        }
        let dragSourceIndex = secondLvlArray.findIndex((el) => el === dragSource);
        let dropTargetIndex = secondLvlArray.findIndex((el) => el === dropTarget);
        let newSecondLvlArray = secondLvlArray;
        if (userLvlSource === userLvlTarget) {
          let removed = newSecondLvlArray.splice(dragSourceIndex, 1, secondLvlArray[dropTargetIndex]);
          newSecondLvlArray.splice(dropTargetIndex, 1, removed[0]);
        } else {
          let calcChildren = 1;
          secondLvlArray.forEach(el => {
            if (el.match(/^\d*/)[0] === userLvlTarget) {
              return calcChildren = calcChildren + 1;
            }
          });
          const newTask = `${userLvlTarget}-${calcChildren}`;
          task[`${newTask}`] = task[`${dragSource}`];
          newSecondLvlArray.splice(dragSourceIndex, 1, newTask);

          let newLastLvlArray = lastLvlArray;
          newLastLvlArray.map((el, key, lastLvlArray) => {
            if ((dropTargetLvl === 1 && el.match(/^\d*/)[0] === userLvlSource) || el.match(/^\d*-\d*/)[0] === dragSource) {
              const newSubTask = el.replace(/^\d*-\d*/, `${newTask}`);
              subTask[`${newSubTask}`] = subTask[`${el}`];
              lastLvlArray[key] = newSubTask;
            }
          });
          this.setState({ lastLvlArray: newLastLvlArray });
        }
        this.setState({ secondLvlArray: newSecondLvlArray });
      }
      if (dragSourceLvl === 3 && dropTargetLvl >= 2) {
        const taskLvlSource = dragSource.match(/^\d*-\d*/)[0];
        const taskLvlTarget = dropTarget.match(/^\d*-\d*/)[0];
        if (taskLvlSource === dropTarget) {
          return;
        }
        let dragSourceIndex = lastLvlArray.findIndex((el) => el === dragSource);
        let dropTargetIndex = lastLvlArray.findIndex((el) => el === dropTarget);
        let newLastLvlArray = lastLvlArray;
        if (userLvlSource === userLvlTarget && taskLvlSource === taskLvlTarget) {
          let removed = newLastLvlArray.splice(dragSourceIndex, 1, lastLvlArray[dropTargetIndex]);
          newLastLvlArray.splice(dropTargetIndex, 1, removed[0]);
        } else {
          let calcChildren = 0;
          lastLvlArray.forEach(el => {
            if (el.match(/^\d*-\d*/)[0] === taskLvlTarget) {
              return calcChildren = calcChildren + 1;
            }
          });
          const newSubTask = `${taskLvlTarget}-${calcChildren}`;
          subTask[`${newSubTask}`] = subTask[`${dragSource}`];
          newLastLvlArray.splice(dropTargetIndex !== -1 ? dropTargetIndex : dragSourceIndex, 1, newSubTask);
        }
        this.setState({ lastLvlArray: newLastLvlArray });
      }
    }
  };

  renderLastLevel = (removeNode, el, taskId) => {
    const { subTask, lastLvlArray } = this.state;
    this.targetButtonRemove = e => removeNode(e, el, lastLvlArray);
    if (el.match(/^\d*-\d*/)[0] === taskId) {
      return (
        <Node
          key={el}
          task={subTask[`${el}`]}
          removeNode={this.targetButtonRemove}
          level={3}
          sortId={el}
          replaceList={this.replaceList}
        />
      );
    }
  };

  renderSecondLevel = (removeNode, taskId, userId) => {
    const { task, lastLvlArray, secondLvlArray } = this.state;
    this.targetButtonRemove = e => removeNode(e, taskId, secondLvlArray);
    this.targetButtonAdd = () => this.setState({ modalShow: true, nodeAdd: taskId });
    if (taskId.match(/^\d*/)[0] === userId) {
      let calcChildren = 0;
      lastLvlArray.forEach(el => {
        if (el.match(/^\d*-\d*/)[0] === taskId) {
          return calcChildren = calcChildren + 1;
        }
      });
      return (
        <Node
          key={taskId}
          task={task[`${taskId}`]}
          level={2}
          calcChildren={calcChildren}
          addNode={this.targetButtonAdd}
          removeNode={this.targetButtonRemove}
          sortId={taskId}
          replaceList={this.replaceList}
        >
          {calcChildren ? lastLvlArray.map(el => this.renderLastLevel(this.removeNode, el, taskId)) : null}
        </Node>
      );
    }
  };

  renderFirstLevel = (removeNode, node) => {
    const { user, secondLvlArray, firstLvlArray } = this.state;
    this.targetRemoveButton = e => removeNode(e, node, firstLvlArray);
    this.targetButtonAdd = () => this.setState({ modalShow: true, nodeAdd: node });
    let calcChildren = 0;
    secondLvlArray.forEach(el => {
      if (el.match(/^\d*/)[0] === node) {
        return calcChildren = calcChildren + 1;
      }
    });
    return (
      <Node
        key={node}
        name={user[`${node}`]}
        calcChildren={calcChildren}
        addNode={this.targetButtonAdd}
        removeNode={this.targetRemoveButton}
        sortId={node}
        replaceList={this.replaceList}
      >
        {calcChildren ? secondLvlArray.map(el => this.renderSecondLevel(this.removeNode, el, node)) : null}
      </Node>
    );
  };

  render() {
    return (
      <Panel className='sortable-list'>
        {this.state.firstLvlArray.map(el => this.renderFirstLevel(this.removeNode, el))}
        <Modal show={this.state.modalShow}>
          <ModalContent>
            <ModalClose onClick={this.modalClose}>&times;</ModalClose>
            <div>
              <InputGroup
                className="input-group counter-input"
                GroupMargin="0 30px 0 0"
              >
                <Label
                  className="input-group-addon"
                >
                  Task:
                </Label>
                <Input
                  maxLength="70"
                  type="text"
                  placeholder="Task"
                  onChange={this.onChangeTask}
                  value={this.state.taskName}
                />
              </InputGroup>
            </div>
            <button onClick={this.addNewNode}>Save</button>
          </ModalContent>
        </Modal>
      </Panel>
    );
  }
}

TreeNode.propTypes = {
  user: PropTypes.object.isRequired,
  task: PropTypes.object,
  subTask: PropTypes.object,
  firstLvlArray: PropTypes.array,
  secondLvlArray: PropTypes.array,
  lastLvlArray: PropTypes.array,
};

TreeNode.defaultProps = {
  task: {},
  subTask: {},
  firstLvlArray: [],
  secondLvlArray: [],
  lastLvlArray: [],
};

export default TreeNode;

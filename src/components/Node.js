import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PanelHeader = styled.div`
  background: red;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const Panel = styled.li`
  margin-bottom: 10px;
  margin-top: 10px;
  list-style: none;

  &.level-2 {
    ${PanelHeader} {
      background-color: green;
    }
    margin-left: 100px;
  }

  &.level-3 {
    ${PanelHeader} {
      background-color: blue;
    }
    margin-left: 200px;
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const FlexBlock = styled.div`
  display: flex;
  align-items: center;
`;

const CalcChildren = styled.span`
  background: #000;
  border-radius: 50%;
  margin: 0;
  text-align: center;
  width: 40px;
  font-size: 2em;
`;

const Block = styled.div`
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
  margin: 0 20px;
`;

class Node extends Component {
  constructor() {
    super();
    this.state = {
      isDragging: false,
      isDragOver: false,
    };
  };

  onDragStart = (e) => {
    e.stopPropagation();
    this.setState({ isDragging: true });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.props.sortId);
  };

  onDragEnter = () => this.setState({ isDragOver: true });

  onDragOver = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  };

  onDragLeave = () => this.setState({ isDragOver: false });

  onDrop = (e) => {
    this.setState({ isDragging: false, isDragOver: false });
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    const dragSourceTitle = e.dataTransfer.getData('text/html');
    this.props.replaceList(dragSourceTitle, this.props.sortId);
    return false;
  };

  onDragEnd = () => this.setState({ isDragging: false, isDragOver: false });

  render() {
    const {
      name,
      task,
      level,
      calcChildren,
      removeNode,
      addNode,
      children,
      sortId,
      ...props
    } = this.props;
    const arrClassName = [
      `level-${level}`,
      this.state.isDragging ? 'dragging' : '',
      this.state.isDragOver ? 'dragover' : '',
    ];
    const strClassName = arrClassName.join(' ');
    return (
      <Panel
        draggable={true}
        className={strClassName}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onDragEnd={this.onDragEnd}
        data-id={sortId}
        {...props}
      >
        <PanelHeader>
          <Title>{name ? `User '${name}'` : `Task '${task}'`} (Level {level})</Title>
          <FlexBlock>
            <Block>
              <Button onClick={removeNode}>&times;</Button>
              {level !== 3 ? <Button onClick={addNode}>+</Button> : null}
            </Block>
            {calcChildren ? <CalcChildren>{calcChildren}</CalcChildren> : null}
          </FlexBlock>
        </PanelHeader>
        {children ? <ul>
          {children}
        </ul> : null}
      </Panel>
    );
  }
}

Node.propTypes = {
  name: PropTypes.string,
  task: PropTypes.string,
  level: PropTypes.number,
  children: PropTypes.node,
  calcChildren: PropTypes.number,
  removeNode: PropTypes.func,
  addNode: PropTypes.func,
  sortId: PropTypes.string,
  replaceList: PropTypes.func,
};

Node.defaultProps = {
  name: '',
  task: '',
  level: 1,
  calcChildren: 0,
  moveInMiddle: false,
};

export default Node;

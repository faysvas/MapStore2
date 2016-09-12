/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const assign = require('object-assign');
import {findDOMNode}from 'react-dom';

const dragSource = require('react-dnd').DragSource;
const dropTarget = require('react-dnd').DropTarget;
const Types = {NODE: 'node'};

const nodeSource = {
    beginDrag: function(props) {
        return {
            index: props.index,
            id: props.node.id,
            parent: props.parent,
            node: props.node
        };
    }
};
const sourceCollect = function(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
};
const nodeTarget = {
    hover(targetProps, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = targetProps.index;
        const targetId = targetProps.node.id;
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;
        const targetParent = targetProps.parent;
        const sourceParent = sourceProps.parent;

        if (dragIndex === hoverIndex) {return; }

        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {return; }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {return; }

        if (targetParent === sourceParent) {
            if (sourceId !== targetId && sourceProps.parent !== targetId) {
                targetProps.moveNode(dragIndex, hoverIndex);
                monitor.getItem().index = hoverIndex;
            }
        }
    }
};
const targetCollect = function(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
};
const NodeComponent = React.createClass({
            propTypes: {
                moveNodes: React.PropTypes.func,
                node: React.PropTypes.object,
                style: React.PropTypes.object,
                styler: React.PropTypes.func,
                className: React.PropTypes.string,
                type: React.PropTypes.string,
                connectDragSource: React.PropTypes.func.isRequired,
                connectDropTarget: React.PropTypes.func,
                isDragging: React.PropTypes.bool.isRequired,
                isOver: React.PropTypes.bool,
                moveNode: React.PropTypes.func,
                index: React.PropTypes.number,
                onSort: React.PropTypes.func,
                isDraggable: React.PropTypes.bool
            },
            getDefaultProps() {
                return {
                    moveNodes: () => {},
                    node: null,
                    style: {},
                    styler: () => {},
                    className: "",
                    type: 'node',
                    onSort: null
                };
            },
            renderChildren(filter = () => true) {
                return React.Children.map(this.props.children, (child) => {
                    if (filter(child)) {
                        let props = (child.type.inheritedPropTypes || [
                            'node'
                        ]).reduce((previous, propName) => {
                            return this.props[propName] ?
                                assign(previous, {
                                    [propName]: this.props[
                                        propName]
                                }) : previous;
                        }, {});
                        return React.cloneElement(child, props);
                    }
                });
            },
            render() {
                const connectDragSource = this.props.connectDragSource;
                const connectDropTarget = this.props.connectDropTarget;

                let expanded = (this.props.node.expanded !== undefined) ? this.props.node.expanded : true;
                let prefix = this.props.type;
                const nodeStyle = assign({}, this.props.style, this.props.styler(this.props.node));
                let content = (<div key={this.props.node.name} className={(expanded ? prefix + "-expanded" : prefix + "-collapsed") + " " + this.props.className} style={nodeStyle} >
				{this.renderChildren((child) => child && child.props.position !== 'collapsible')}
				{expanded ? this.renderChildren((child) => child && child.props.position === 'collapsible') : []}
        </div>);
                return this.props.isDraggable ? connectDragSource(connectDropTarget(content)) : content;
            }
            });

const NodeTarget = dropTarget(Types.NODE, nodeTarget, targetCollect)(NodeComponent);
const Node = dragSource(Types.NODE, nodeSource, sourceCollect)(NodeTarget);

module.exports = Node;

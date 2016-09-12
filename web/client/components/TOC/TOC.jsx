/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const dragDropContext = require('react-dnd').DragDropContext;
const html5Backend = require('react-dnd-html5-backend');
const update = require('react/lib/update');

const TOC = React.createClass({
            propTypes: {
                filter: React.PropTypes.func,
                nodes: React.PropTypes.array,
                id: React.PropTypes.string,
                onSort: React.PropTypes.func,
                index: React.PropTypes.number,
                moveNode: React.PropTypes.func
            },
			getInitialState: function() {
                return {
                    nodes: this.props.nodes,
                    children: this.props.children,
                    id: this.props.id,
                    index: this.props.index,
                    filter: this.props.filter,
					onSort: this.props.onSort
                };
            },
            getDefaultProps() {
                return {
                    filter() {
                            return true;
                        },
                        nodes: [],
                        id: 'mapstore-layers'
                };
            },
            render() {
                let content = [];
                const nodes = this.state.nodes;
                const filteredNodes = nodes.filter(this.state.filter);
                if (this.state.children) {
                    content = filteredNodes.map((node, i) => React.cloneElement(this.state.children, {
                            node: node,
                            index: i,
                            moveNode: this.moveNode,
                            key: node.name || 'default',
                            isDraggable: !!this.state.onSort,
                            parent: "top"
                        }));
                }
                if (this.state.onSort) {
                    return (<div id = {this.state.id} > {content} </div>);
                }
            },
			moveNode(dragIndex, hoverIndex) {
                const {nodes} = this.state;
                const dragCard = nodes[dragIndex];
                this.setState(update(this.state, {
                    nodes: {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard]
                        ]
                    }
                }));
            }
});

module.exports = dragDropContext(html5Backend)(TOC);

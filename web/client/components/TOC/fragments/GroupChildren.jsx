/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const update = require('react/lib/update');
require('./css/groupchildren.css');

const GroupChildren = React.createClass({
            propTypes: {
                node: React.PropTypes.object,
                filter: React.PropTypes.func,
                onSort: React.PropTypes.func,
                moveNode: React.PropTypes.func,
                index: React.PropTypes.number
            },
            statics: {
                inheritedPropTypes: ['node', 'filter']
            },
			getInitialState: function() {
    return {
                    node: this.props.node,
                    nodes: this.props.node.nodes,
                    children: this.props.children,
                    id: this.props.node.id,
                    index: this.props.node.index,
                    filter: this.props.filter
                };
},
            getDefaultProps() {
                return {
                    node: null,
                    filter: () => true
                };
            },
            render() {
                let content = [];

                if (this.state.node) {
                    let nodes = (this.state.nodes || []).filter((node) => this.state.filter(node, this.state.node));
                    content = nodes.map((node, i) => (React.cloneElement(this.state.children, {
                            node: node,
                            key: node.id,
                            index: i,
                            isDraggable: !!this.props.onSort,
                            moveNode: this.moveNode,
                            parent: this.state.node.id
                        })));
                }
                if (this.props.onSort) {
                    return ( < div className = "toc-group-children" > {content} </div>);
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

module.exports = GroupChildren;

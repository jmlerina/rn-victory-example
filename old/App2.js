import { random, range } from "lodash";
import React, { Component } from "react";

import {
  View,
  StyleSheet
} from "react-native";

import {
  VictoryChart,
  VictoryScatter,
  VictoryZoomContainer,
} from "victory-native";

// 10000 points (10 / 0.001 = 10000) - see what happens when you render 50k or 100k
const allData = _.range(0, 10, 0.001).map(x => ({
	x: x,
  y: Math.sin(Math.PI*x/2) * x / 10
}));

export default class App extends Component {
  constructor(props) {
  	super();
    this.entireDomain = this.getEntireDomain(props);
   	this.state = {
    	zoomedXDomain: this.entireDomain.x,
    };
  }
	onDomainChange(domain) {
  	this.setState({
    	zoomedXDomain: domain.x,
    });
  }
  getData() {
  	const { zoomedXDomain } = this.state;
    const { data, maxPoints } = this.props;
  	const filtered = data.filter(
    	(d) => (d.x >= zoomedXDomain[0] && d.x <= zoomedXDomain[1]));

    if (filtered.length > maxPoints ) {
      const k = Math.ceil(filtered.length / maxPoints);
    	return filtered.filter(
      	(d, i) => ((i % k) === 0)
      );
    }
    return filtered;
  }
  getEntireDomain(props) {
  	const { data } = props;
    return {
    	y: [_.minBy(data, d => d.y).y, _.maxBy(data, d => d.y).y],
      x: [ data[0].x, _.last(data).x ]
    };
  }
  getZoomFactor() {
    const { zoomedXDomain } = this.state;
    const factor = 10 / (zoomedXDomain[1] - zoomedXDomain[0]);
    return _.round(factor, factor < 3 ? 1 : 0);
  }
	render() {
    const renderedData = this.getData();
  	return (
    	<div>
        <VictoryChart
          domain={this.entireDomain}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            onZoomDomainChange={this.onDomainChange.bind(this)}
            minimumZoom={{x: 1/10000}}
          />}
        >
          <VictoryScatter data={renderedData} />
        </VictoryChart>
        <div>
          {this.getZoomFactor()}x zoom;
          rendering {renderedData.length} of {this.props.data.length}
        </div>
      </div>
    );
  }
}
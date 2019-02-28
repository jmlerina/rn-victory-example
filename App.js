import { random, range } from "lodash";
import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet
} from "react-native";

import {
  VictoryChart,
  VictoryScatter,
  VictoryZoomContainer,
} from "victory-native";

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    data: this.getScatterData()
  }

  getScatterData() {
    return range(100).map((index) => {
      return {
        x: random(1, 50),
        y: random(1, 100),
        size: random(8) + 3
      };
    });
  }

  onDomainChange(domain) {
  	this.setState({
    	zoomedXDomain: domain.x,
    });
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
    return (
      <View style={custom.container}>
        <Text style={custom.txt}>
          Hold ctrl key to zoom in or out, if this is a virtual device.
        </Text>
        <VictoryChart
          domain={{y: [0, 100]}}
          containerComponent={
            <VictoryZoomContainer 
              zoomDomain={{x: [0, 35], y: [0, 70]}}
            />
          }
        >
          <VictoryScatter
            data={this.state.data}
            style={{
              data: {
                opacity: (d) =>  d.x % 5 === 0 ? 1 : 0.7,
                fill: (d) => d.y % 5 === 0 ? "darkblue" : "tomato",
              }
            }}
          />
        </VictoryChart>
      </View>
    )
  }
}

const custom = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'gray',
  },
  txt:{
    fontSize: 24,
    alignItems: 'center',
    textAlign: 'center',
    margin: 12
  }
})
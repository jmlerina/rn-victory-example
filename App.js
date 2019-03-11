import { random, range } from "lodash";
import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";

import {
  VictoryChart,
  VictoryScatter,
  VictoryZoomContainer,
} from "victory-native";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.dots = [];
    this.state = {
      inputX: '50',
      inputY: '100',
      data: this.dots
    }
  }
  getScatterData(currentX = this.state.inputX, currentY = this.state.inputY) {
    this.dots.push({ 
      x: Number(currentX),
      y: Number(currentY),
      size: random(8) + 7
    })
    this.setState({
      data: this.dots
    })
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
              zoomDomain={{x: [0, 50], y: [0, 100]}}
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
        <Text>
            X:
        </Text>
        <TextInput
          keyboardType={'numeric'}
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({inputX:text})}
          value={this.state.inputX}
        />
        <Text>
            {'\n'}Y:
        </Text>
        <TextInput
          keyboardType={'numeric'}
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({inputY:text})}
          value={this.state.inputY}
        />
        <TouchableOpacity style={custom.button} onPress={() => this.getScatterData()}>
          <Text style={{fontWeight:'bold'}}>
            NEW DOT !
          </Text>
        </TouchableOpacity>
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
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 20
  }
})
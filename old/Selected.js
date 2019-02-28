/*global setInterval*/
/* demo.js is loaded by both index.ios.js and index.android.js */

import { random, range } from "lodash";
import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Platform,
  Text
} from "react-native";
import Svg from "react-native-svg";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryStack,
  VictoryCandlestick,
  VictoryErrorBar,
  VictoryBar,
  VictoryLine,
  VictoryArea,
  VictoryScatter,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryVoronoiContainer,
  VictorySelectionContainer,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryPie,
  createContainer
} from "victory-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#e1d7cd",
    justifyContent: "center",
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 50
  },
  text: {
    fontSize: 18,
    fontFamily: (Platform.OS === "ios") ? "Menlo" : "monospace",
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 20
  },
  heading: {
    fontSize: 27,
    fontFamily: (Platform.OS === "ios") ? "Menlo" : "monospace",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 30
  }
});

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      y: this.getYFunction(),
      style: this.getStyles(),
      transitionData: this.getTransitionData(),
      randomData: this.generateRandomData(),
      staticRandomData: this.generateRandomData(15),
      data: this.getData()
    };
  }
  getYFunction() {
    const n = random(2, 7);
    return (data) => Math.exp(-n * data.x) * Math.sin(2 * n * Math.PI * data.x);
  }

  generateRandomData(points = 6) {
    return range(1, points + 1).map((i) => ({x: i, y: i + random(-1, 2)}));
  }

  getData() {
    return range(1, 10).map((i) => ({x: i, y: random(1, 10)}));
  }

  getStyles() {
    const colors = [
      "red", "orange", "magenta",
      "gold", "blue", "purple"
    ];
    return {
      stroke: colors[random(0, 5)],
      strokeWidth: random(1, 5)
    };
  }

  getTransitionData() {
    const n = random(4, 10);
    return range(n).map((i) => {
      return {
        x: i,
        y: random(2, 10)
      };
    });
  }

  changeScroll(scrollEnabled) {
    this.setState({scrollEnabled});
  }

  updateDemoData() {
    this.setState({
      y: this.getYFunction(),
      style: this.getStyles(),
      transitionData: this.getTransitionData(),
      randomData: this.generateRandomData(),
      data: this.getData()
    });
  }

  componentDidMount() {
    setInterval(this.updateDemoData.bind(this), 3000);
  }
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={this.state.scrollEnabled}>
        <Text style={styles.heading}>{"Victory Native"}</Text>

        <Text style={styles.text}>{"VictoryBrushContainer"}</Text>
        <VictoryChart
          containerComponent={
            <VictoryBrushContainer
              onTouchStart={() => this.changeScroll(false)}
              onTouchEnd={() => this.changeScroll(true)}
              selectionStyle={{fill: "blue", fillOpacity: 0.1}}
            />
          }
        >
          <VictoryBar/>
        </VictoryChart>

        <Text style={styles.text}>{"VictorySelectionContainer"}</Text>
        <VictoryChart
          containerComponent={
            <VictorySelectionContainer
              onTouchStart={() => this.changeScroll(false)}
              onTouchEnd={() => this.changeScroll(true)}
              labels={(d) => `( ${d.x} , ${d.y} )`}
            />
          }
        >
          <VictoryScatter
            data={this.state.staticRandomData}
            style={{ data: {fill: (d, active) => active ? "tomato" : "gray"}}}
          />
        </VictoryChart>

        <Text style={styles.text}>{"VictoryZoomContainer"}</Text>
        <VictoryChart
          containerComponent={
            <VictoryZoomContainer
              onTouchStart={() => this.changeScroll(false)}
              onTouchEnd={() => this.changeScroll(true)}
            />
          }
        >
         <VictoryBar/>
        </VictoryChart>

        <Text style={styles.text}>{"VictoryVoronoiContainer"}</Text>
        <VictoryChart
          containerComponent={
            <VictoryVoronoiContainer
              onTouchStart={() => this.changeScroll(false)}
              onTouchEnd={() => this.changeScroll(true)}
              labels={(d) => `( ${d.x} , ${d.y} )`}
            />
          }
        >
         <VictoryLine data={this.state.staticRandomData} />
        </VictoryChart>

        <Text style={styles.text}>{'createContainer("zoom", "voronoi")'}</Text>

        <VictoryChart
          containerComponent={
            <VictoryZoomVoronoiContainer
              onTouchStart={() => this.changeScroll(false)}
              onTouchEnd={() => this.changeScroll(true)}
              labels={(d) => `( ${d.x} , ${d.y} )`}
              dimension={"x"}
            />
          }
        >
         <VictoryScatter data={this.state.staticRandomData} />
        </VictoryChart>
      </ScrollView>
    );
  }
}
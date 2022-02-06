
import React, { Component } from "react";
import Alert from "./src/Alert";
// import World from "./src/World"
// import WorldPhysic from "./src/WorldPhysic"
// import WorldAutos from "./src/WorldAutos"
import WolrdLaberinto from "./src/WorldLaberinto"
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }
  render() {
    return (
      <>
        {/* <World /> */}
        {/* <WorldPhysic /> */}
        <WolrdLaberinto/>
        {/* <WorldAutos /> */}
        <Alert />
      </>
    )
  }
}
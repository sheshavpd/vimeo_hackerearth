import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Icon } from "bloomer";
import Transactions from "./Transactions";
import "../styles.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.data = [];
  }

  render() {
    return (
      <div>
        <Transactions />
      </div>
    );
  }
}

export default hot(module)(Home); //

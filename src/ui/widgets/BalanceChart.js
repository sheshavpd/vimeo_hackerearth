import React, { Component } from "react";
import { Icon } from "bloomer";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/lines";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/visualMap";

class BalanceChart extends Component {
  getOptions() {
    const data = [];
    this.props.transactions.forEach(tx => {
      data.push({
        name: tx.jsDate.toString(),
        value: [
          [
            tx.jsDate.getFullYear(),
            tx.jsDate.getMonth() + 1,
            tx.jsDate.getDate()
          ].join("/"),
          tx.balAmount
        ]
      });
    });
    return {
      title: {
        text: "Balance over time"
      },
      tooltip: {
        show: true,
        trigger: "axis",
        formatter: function(params) {
          params = params[0];
          var date = new Date(params.name);
          return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear() +
            " : INR. " +
            params.value[1]
          );
        }
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false
        }
      },
      series: [
        {
          type: "line",
          showSymbol: true,
          data: data,
          areaStyle: {},
          smooth: true,
          color: "#32cc9a"
        }
      ]
    };
  }

  render() {
    return (
      <div style={{ marginTop: -10 }}>
        <ReactEchartsCore echarts={echarts} option={this.getOptions()} />
        <div style={{ textAlign: "center", marginTop: -10 }}>
          Balance over time
        </div>
      </div>
    );
  }
}

export default BalanceChart; //

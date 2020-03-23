import React, { Component } from "react";
import { Icon } from "bloomer";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/visualMap";

class BalanceChart extends Component {
  getOptions() {
    const xAxisData = [];
    const withdraws = [];
    const deposits = [];
    const txOnDates = {};
    this.props.transactions.forEach(tx => {
      if (!txOnDates[tx["Date"]]) {
        txOnDates[tx["Date"]] = { withdrawals: 0, deposits: 0 };
      }
      if (tx["Withdrawal AMT"])
        txOnDates[tx["Date"]].withdrawals += tx.txAmount;
      else txOnDates[tx["Date"]].deposits += tx.txAmount;
    });

    Object.keys(txOnDates).forEach(key => {
      withdraws.push(txOnDates[key].withdrawals);
      deposits.push(txOnDates[key].deposits);
      xAxisData.push(key);
    });
    const emphasisStyle = {
      itemStyle: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "rgba(0,0,0,0.5)"
      }
    };
    return {
      title: {
        text: "Balance over time"
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
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
          name: "Withdrawal",
          type: "bar",
          stack: "one",
          emphasis: emphasisStyle,
          data: withdraws
        },
        {
          name: "Deposit",
          type: "bar",
          stack: "one",
          emphasis: emphasisStyle,
          data: deposits,

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
          Transactions over time
        </div>
      </div>
    );
  }
}

export default BalanceChart; //

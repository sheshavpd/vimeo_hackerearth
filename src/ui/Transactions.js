import React, { Component } from "react";
import { hot } from "react-hot-loader";
import {
  fetchAllTransactions,
  simulateFetchAllTransactions
} from "../api/transactions";
import {
  Progress,
  Message,
  MessageHeader,
  MessageBody,
  Column,
  Columns,
  Button,
  Icon
} from "bloomer";
import FilterTransactions from "./FilterTransactions";
import { getMonthfromStr } from "../helpers";

class AccountHeader extends Component {
  render() {
    return (
      <div className="page-header">
        <div>
          <div className="page-title" style={{ display: "inline" }}>
            <Icon
              isSize="small"
              className="fa fa-university"
              style={{ marginBottom: -3, display: "inline" }}
            />
            &nbsp;YoBank&nbsp;
          </div>
          |&nbsp;
          <Icon
            isSize="small"
            className="fa fa-credit-card"
            style={{ marginBottom: -3, display: "inline" }}
          />
          &nbsp;My Transactions
        </div>
        {this.props.accountNumber && (
          <div>
            <Icon
              isSize="small"
              className="fa fa-hashtag"
              style={{ marginBottom: -3, display: "inline" }}
            />
            &nbsp;{this.props.accountNumber}
          </div>
        )}
      </div>
    );
  }
}
class Transactions extends Component {
  state = {
    loading: true
  };
  constructor(props) {
    super(props);
    this.loadTransactions = this.loadTransactions.bind(this);
    this.onFilterApplied = this.onFilterApplied.bind(this);
  }

  componentDidMount() {
    this.loadTransactions();
  }
  async loadTransactions() {
    this.setState({ error: false, loading: true });
    let data = [];
    let error = false;
    try {
      const res = await simulateFetchAllTransactions();
      data = res.map(tx => {
        const txAmount = parseInt(
          (tx["Withdrawal AMT"]
            ? tx["Withdrawal AMT"]
            : tx["Deposit AMT"]
          ).replace(/,/g, ""),
          10
        );
        const balAmount = parseInt(tx["Balance AMT"].replace(/,/g, ""), 10);
        const strDate = tx["Date"].split(" ");
        const jsDate = new Date(
          2000 + parseInt(strDate[2], 10),
          getMonthfromStr(strDate[1]) - 1,
          parseInt(strDate[0], 10)
        );

        return { ...tx, jsDate, txAmount, balAmount };
      });
    } catch (e) {
      error = true;
    }
    this.setState({
      loading: false,
      transactions: data,
      filteredTransactions: data,
      error
    });
  }

  onFilterApplied(filteredTransactions) {
    this.setState({
      filteredTransactions
    });
  }

  viewTransactions() {
    const { error, loading, transactions } = this.state;
    if (loading || error) return null;
    return (
      <div>
        <FilterTransactions transactions={transactions} />
      </div>
    );
  }

  progressBar() {
    return (
      <Progress isColor="primary" style={{ borderRadius: 0, height: "4px" }} />
    );
  }

  errorMessage() {
    return (
      <Message isColor="danger" style={{ margin: 10, maxWidth: 500 }}>
        <MessageHeader>
          <p>Network Error!</p>
        </MessageHeader>
        <MessageBody style={{ display: "flex", alignItems: "center" }}>
          Please check your internet connection and retry!
          <Button
            onClick={this.loadTransactions}
            isColor="warning"
            style={{ marginLeft: 10 }}
          >
            Retry
          </Button>
        </MessageBody>
      </Message>
    );
  }

  render() {
    const { loading, error, transactions } = this.state;
    return (
      <div>
        <AccountHeader
          accountNumber={
            transactions && transactions[0] && transactions[0]["Account No"]
          }
        />
        {loading && this.progressBar()}
        {error && this.errorMessage()}
        <div style={{ padding: 20 }}>{this.viewTransactions()}</div>
      </div>
    );
  }
}

export default Transactions;

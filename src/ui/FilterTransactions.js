import React, { Component } from "react";
import {
  Checkbox,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  Icon,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  Tab,
  Tabs,
  TabList,
  TabLink
} from "bloomer";
import PaginatedTransactionList from "./PaginatedTransactionList";
import BalanceChart from "./widgets/BalanceChart";
import TxChart from "./widgets/TxChart";

class FilterTransactions extends Component {
  state = {
    showFilters: false,
    withdrawals: true,
    deposits: true,
    details: "",
    minAmount: "",
    maxAmount: "",
    fromDate: "",
    toDate: "",
    sortBy: "Date",
    ascSort: false,
    showStats: false,
    filteredTransactions: [],
    sortedTransactions: []
  };

  constructor(props) {
    super(props);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.toggleSortDir = this.toggleSortDir.bind(this);
    this.setFilterByName = this.setFilterByName.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    this.filter();
  }
  componentDidUpdate(prevProps) {
    if (this.props.transactions !== prevProps.transactions) this.filter();
  }

  toggleFilters() {
    this.setState({ showFilters: !this.state.showFilters });
  }

  toggleTab() {
    this.setState({ showStats: !this.state.showStats });
  }

  async changeSortBy(sortStrategy) {
    await this.setState({ sortBy: sortStrategy });
    this.filter();
  }

  async toggleSortDir() {
    await this.setState({ ascSort: !this.state.ascSort });
    this.filter();
  }

  async setFilterByName(name) {
    await this.setState({
      details: name
    });
    await this.filter();
  }

  async filter() {
    const { minAmount, maxAmount, fromDate, toDate, details } = this.state;
    const minAmountNum = parseInt(minAmount.replace(/,/g, ""), 10);
    const maxAmountNum = parseInt(maxAmount.replace(/,/g, ""), 10);
    const from = fromDate && new Date(fromDate);
    const to = toDate && new Date(toDate);
    const filteredTransactions = this.props.transactions.filter(tx => {
      if (!this.state.withdrawals && tx["Withdrawal AMT"]) return false;
      if (!this.state.deposits && tx["Deposit AMT"]) return false;
      if (
        details &&
        tx["Transaction Details"]
          .toLowerCase()
          .indexOf(details.toLowerCase()) === -1
      )
        return false;

      if (!isNaN(minAmountNum) && tx.txAmount < minAmountNum) return false;
      if (!isNaN(maxAmountNum) && tx.txAmount > maxAmountNum) return false;
      if (from && tx.jsDate.getTime() < from.getTime()) return false;
      if (to && tx.jsDate.getTime() > to.getTime()) return false;
      return true;
    });

    await this.sortFilteredTx(filteredTransactions);
  }

  async sortFilteredTx(txs) {
    const { ascSort } = this.state;
    const txAmtKey = "Transaction Amount";
    let sortedTxs = [...txs];
    if (this.state.sortBy === "Date") {
      sortedTxs = sortedTxs.sort((tx1, tx2) => {
        return ascSort
          ? tx1.jsDate.getTime() - tx2.jsDate.getTime()
          : tx2.jsDate.getTime() - tx1.jsDate.getTime();
      });
    } else if (this.state.sortBy === txAmtKey) {
      sortedTxs = sortedTxs.sort((tx1, tx2) => {
        return ascSort
          ? tx1.txAmount - tx2.txAmount
          : tx2.txAmount - tx1.txAmount;
      });
    }
    await this.setState({
      filteredTransactions: txs,
      sortedTransactions: sortedTxs
    });
  }

  async handleCheckbox(e) {
    await this.setState({ [e.target.name]: !this.state[e.target.name] });
    this.filter();
  }
  async handleValueChange(e) {
    await this.setState({
      [e.target.name]: e.target.value
    });
    this.filter();
  }

  renderFilters() {
    const { showFilters, withdrawals, deposits } = this.state;
    if (!showFilters) return null;
    return (
      <div className="filter-container">
        <Checkbox
          name="withdrawals"
          checked={withdrawals}
          onChange={this.handleCheckbox}
        >
          Withdrawals
        </Checkbox>{" "}
        &nbsp;&nbsp;
        <Checkbox
          name="deposits"
          checked={deposits}
          onChange={this.handleCheckbox}
        >
          Deposits
        </Checkbox>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          Transaction Name:&nbsp;
          <Input
            style={{ maxWidth: 200, display: "inline" }}
            name="details"
            value={this.state.details}
            onChange={this.handleValueChange}
            type="text"
            placeholder="Eg: bulk transfer"
          />
        </div>
        <br />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.05)",
            marginTop: 5,
            padding: 5,
            flexFlow: "wrap"
          }}
        >
          <div className="vertical-center">
            From Date:&nbsp;
            <Input
              style={{
                maxWidth: 160,
                display: "inline",
                marginLeft: 10
              }}
              name="fromDate"
              value={this.state.fromDate}
              onChange={this.handleValueChange}
              type="date"
              placeholder="From Date"
            />
          </div>
          &nbsp;&nbsp;
          <div className="vertical-center">
            To Date:&nbsp;
            <Input
              style={{ maxWidth: 160, display: "inline", marginLeft: 10 }}
              name="toDate"
              value={this.state.toDate}
              onChange={this.handleValueChange}
              type="date"
              placeholder="To Date"
            />
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.05)",
            padding: 5
          }}
        >
          Transaction Amount:&nbsp;
          <Input
            style={{ maxWidth: 150, display: "inline", marginLeft: 10 }}
            name="minAmount"
            value={this.state.minAmount}
            onChange={this.handleValueChange}
            type="text"
            placeholder="Min. Amount"
          />
          <Input
            style={{ maxWidth: 150, display: "inline", marginLeft: 10 }}
            name="maxAmount"
            value={this.state.maxAmount}
            onChange={this.handleValueChange}
            type="text"
            placeholder="Max. Amount"
          />
        </div>
      </div>
    );
  }

  renderSortButton() {
    const { sortBy } = this.state;
    return (
      <div style={{ display: "inline" }}>
        <Dropdown isHoverable style={{ marginLeft: 10 }}>
          <DropdownTrigger>
            <Button
              isSize="small"
              isColor="info"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              <Icon
                isSize="small"
                className="fa fa-sort"
                style={{ marginBottom: -3 }}
              />
              &nbsp;&nbsp;Sort by: {sortBy}
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownContent>
              <DropdownItem
                onClick={() => {
                  this.changeSortBy("Date");
                }}
                isActive={sortBy === "Date"}
              >
                Date
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  this.changeSortBy("Transaction Amount");
                }}
                isActive={sortBy === "Transaction Amount"}
              >
                Transaction Amount
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>

        <Button
          style={{ marginLeft: 5 }}
          isSize="small"
          isColor="info"
          onClick={this.toggleSortDir}
          isOutlined
        >
          {this.state.ascSort && (
            <Icon
              isSize="small"
              className="fa fa-arrow-up"
              style={{ marginBottom: -3 }}
            />
          )}
          {!this.state.ascSort && (
            <Icon
              isSize="small"
              className="fa fa-arrow-down"
              style={{ marginBottom: -3 }}
            />
          )}
        </Button>
      </div>
    );
  }

  render() {
    const { filteredTransactions, sortedTransactions } = this.state;
    return (
      <div>
        <Button isSize="small" isColor="warning" onClick={this.toggleFilters}>
          {this.state.showFilters && (
            <Icon
              isSize="small"
              className="fa fa-window-close"
              style={{ marginBottom: -3 }}
            />
          )}
          {!this.state.showFilters && (
            <Icon
              isSize="small"
              className="fa fa-filter"
              style={{ marginBottom: -3 }}
            />
          )}
          &nbsp;&nbsp;{this.state.showFilters ? "Hide Filters" : "Show Filters"}
        </Button>

        {this.renderSortButton()}
        {this.renderFilters()}
        <Tabs style={{ marginBottom: 0 }}>
          <TabList>
            <Tab isActive={!this.state.showStats}>
              <TabLink onClick={this.toggleTab}>
                <Icon isSize="small" className="fa fa-th-large" />
                <span>Details</span>
              </TabLink>
            </Tab>
            <Tab isActive={this.state.showStats}>
              <TabLink onClick={this.toggleTab}>
                <Icon isSize="small" className="fa fa-chart-area" />
                <span>Stats</span>
              </TabLink>
            </Tab>
          </TabList>
        </Tabs>
        {this.state.showStats && (
          <div>
            <BalanceChart transactions={filteredTransactions} />
            <TxChart transactions={filteredTransactions} />
          </div>
        )}
        {!this.state.showStats && (
          <PaginatedTransactionList
            onFilterByName={this.setFilterByName}
            transactions={sortedTransactions}
          />
        )}
      </div>
    );
  }
}

export default FilterTransactions;

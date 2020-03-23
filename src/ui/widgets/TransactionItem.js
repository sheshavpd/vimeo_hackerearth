import React, { Component } from "react";
import {
  Card,
  CardContent,
  Content,
  Title,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  Button
} from "bloomer";

class TransactionItem extends Component {
  constructor(props) {
    super(props);
    this.data = [];
  }

  onFilterClick(itemName) {
    if (this.props.onFilterByName) {
      this.props.onFilterByName(itemName);
    }
  }

  render() {
    const withdrawAmt = this.props.transaction["Withdrawal AMT"];
    const depositAmt = this.props.transaction["Deposit AMT"];
    const balanceAmt = this.props.transaction["Balance AMT"];
    return (
      <div className="TransactionItem">
        <div className={`dateDiv ${withdrawAmt ? "withdraw" : "deposit"}`}>
          <Icon
            isSize="small"
            className="fa fa-calendar"
            style={{ marginBottom: -3, display: "inline" }}
          />
          <div style={{ marginLeft: 5, display: "inline" }}>
            {this.props.transaction["Date"]}
          </div>
        </div>
        <Card className={`${withdrawAmt ? "withdraw" : "deposit"}`}>
          <CardContent>
            <Title
              isSize={6}
              style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
            >
              {this.props.transaction["Transaction Details"]}&nbsp;&nbsp;
              <Dropdown isHoverable>
                <DropdownTrigger>
                  <Button
                    onClick={() => {
                      this.onFilterClick(
                        this.props.transaction["Transaction Details"]
                      );
                    }}
                    isSize="small"
                    isColor="primary"
                  >
                    <Icon
                      isSize="small"
                      className="fa fa-filter"
                      style={{ marginBottom: -3, display: "inline" }}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownContent className="hover-popup">
                    Filter transactions by this name
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
            </Title>
            <Content>
              {withdrawAmt ? "Withdrawal" : "Deposit"}: INR.&nbsp;
              <b className={withdrawAmt ? "withdraw-text" : "deposit-text"}>
                {withdrawAmt || depositAmt}
              </b>
              <br />
              Balance: INR.&nbsp;
              <b>{balanceAmt}</b>
              <br />
            </Content>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default TransactionItem;

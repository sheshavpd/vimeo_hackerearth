import React, { Component } from "react";
import {
  PageEllipsis,
  Page,
  PageLink,
  PageControl,
  PageList,
  Pagination,
  Column,
  Columns
} from "bloomer";
import TransactionItem from "./widgets/TransactionItem";

const TRANSACTIONS_PER_PAGE = 12;

class PaginatedTransactionList extends Component {
  state = { currentPage: 0 };

  setCurrentPage(pageIndex) {
    const { transactions } = this.props;
    if (!this.pageExists(pageIndex)) return;
    this.setState({
      currentPage: pageIndex
    });
  }

  getPageLink(pageIndex) {
    const { currentPage } = this;
    return (
      <Page key={pageIndex}>
        <PageLink
          onClick={() => {
            this.setCurrentPage(pageIndex);
          }}
          isCurrent={currentPage === pageIndex}
        >
          {pageIndex + 1}
        </PageLink>
      </Page>
    );
  }

  pageExists(pageIndex) {
    return (
      this.props.transactions.length > 0 &&
      pageIndex >= 0 &&
      pageIndex * TRANSACTIONS_PER_PAGE < this.props.transactions.length
    );
  }

  renderPageLinks() {
    const { transactions } = this.props;
    const { currentPage } = this;
    if (transactions.length === 0) return null;
    const coveredPages = {};
    const links = [];
    const pushLinks = (fromIdx, toIdx) => {
      for (let i = fromIdx; i <= toIdx; i++) {
        if (!this.pageExists(i) || coveredPages[i]) continue;
        coveredPages[i] = true;
        links.push({ index: i, link: this.getPageLink(i) });
      }
    };
    pushLinks(0, 0);
    pushLinks(currentPage - 1, currentPage + 1);
    const maxIndex = Math.floor(transactions.length / TRANSACTIONS_PER_PAGE);
    pushLinks(maxIndex - 1, maxIndex);

    const renderedLinks = [];
    let lastIdx = 0;
    links.forEach(link => {
      const idx = link.index;
      if (idx - lastIdx > 1) {
        renderedLinks.push(
          <Page key={lastIdx + 1}>
            <PageEllipsis />
          </Page>
        );
      }
      renderedLinks.push(link.link);
      lastIdx = link.index;
    });

    return (
      <Pagination>
        <PageControl
          disabled={currentPage === 0}
          onClick={() => {
            this.setCurrentPage(currentPage - 1);
          }}
        >
          Previous
        </PageControl>
        <PageControl
          disabled={currentPage === maxIndex}
          isNext
          onClick={() => {
            this.setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </PageControl>
        <PageList>{renderedLinks}</PageList>
      </Pagination>
    );
  }
  renderPage() {
    const { transactions } = this.props;
    let { currentPage } = this;

    if (!transactions || transactions.length === 0) {
      return <h2>No transactions to show</h2>;
    }

    const columns = [];
    const minIndex = currentPage * TRANSACTIONS_PER_PAGE;
    const maxIndex = minIndex + TRANSACTIONS_PER_PAGE;
    for (let i = minIndex; i < maxIndex && i < transactions.length; i++) {
      columns.push(
        <Column isSize={{ mobile: "full", desktop: "1/4" }} key={i}>
          <TransactionItem
            onFilterByName={this.props.onFilterByName}
            transaction={transactions[i]}
          />
        </Column>
      );
    }

    return (
      <div>
        <Columns isCentered isGrid isMultiline>
          {columns}
        </Columns>
      </div>
    );
  }
  render() {
    this.currentPage = this.pageExists(this.state.currentPage)
      ? this.state.currentPage
      : 0;

    return (
      <div style={{ marginTop: 10 }}>
        {this.renderPage()}
        {this.renderPageLinks()}
      </div>
    );
  }
}

export default PaginatedTransactionList;

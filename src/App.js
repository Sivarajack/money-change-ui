import React, { Component } from 'react';
import './App.css';
import Panel from 'react-bootstrap/lib/Panel';
import RateChart from './components/rate-chart/RateChart';
import 'bootstrap/dist/css/bootstrap.css';
import TransactionTable from './components/transaction-table/TransactionTable';
import TransactionRateChart from './components/transaction-rates-graph/transactions-rates-graph';
class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h2 id="header">Money ExChange</h2>
        </header>
          <div id="contents">
              <Panel>
                  <Panel.Body>
              <RateChart></RateChart>
                  </Panel.Body>
              </Panel>
              <Panel>
                  <Panel.Heading>
                      <span id="transactionHeading">Transactions</span>
                  </Panel.Heading>
                  <Panel.Body>
              <TransactionTable></TransactionTable>
                  </Panel.Body>
              </Panel>
              <Panel>
                  <Panel.Body>
              <TransactionRateChart/>
                  </Panel.Body>
              </Panel>
          </div>
      </div>
    );
  }
}

export default App;

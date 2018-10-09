import React from 'react';
import './TransactionTable.css'
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Papa from "papaparse";

class TransactionTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transactions: []
        }
    }
    componentWillMount(props) {
        var csvFilePath = require("./../../data/transactions.csv");
        let rates;
        let parsePromise = function (file) {
            return new Promise(function (resolve, reject) {
                return Papa.parse(csvFilePath, {
                    header: true,
                    download: true,
                    complete: function (results) {

                        resolve(results.data.map((entry,index) => {entry.id = index; return entry}));
                    }
                })
            });
        };
        parsePromise(csvFilePath).then(function (results) {
            this.setState({transactions: results});

        }.bind(this));
    }


    render() {

        const columns = [
            {

                columns: [
                    {
                        Header: 'BaseCurrency',
                        accessor: 'BaseCurrency',
                        filterMethod: (filter, row) =>

                            row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                    }
                ]
            },
            {

                columns: [
                    {
                        id:'WantedCurrency',
                        Header: 'WantedCurrency',
                        accessor: d=> d.WantedCurrency,
                        filterMethod: (filter, row) =>
                            row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                    }
                ]
            }, {

                columns: [
                    {
                        Header: 'AmountInBaseCurrency',
                        accessor: 'AmountInBaseCurrency',
                        filterMethod: (filter, row) =>
                            row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                    }
                ]
            }, {

                columns: [
                    {
                        Header: 'ClientType',
                        accessor: 'ClientType',
                        filterMethod: (filter, row) =>
                         row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    }
                ]
            },
            {

                columns: [
                    {
                        Header: 'TransactionTime',
                        accessor: 'TransactionTime',
                        filterMethod: (filter, row) =>
                            row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    }
                ]
            }
        ]
        return <div>
            <ReactTable
                data={this.state.transactions}
                columns={columns}
                noDataText="No Data Available"
                filterable
                defaultPageSize={20}
                defaultFilterMethod={(filter, row) =>
                    String(row[filter.id]) === filter.value}
                defaultSorted={[
                    {
                        id: "TransactionTime",
                        desc: false
                    }
                ]}
                className="-striped -highlight"/>
        </div>
    }
}

export default TransactionTable;
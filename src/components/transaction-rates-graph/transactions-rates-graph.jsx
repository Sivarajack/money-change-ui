import React from 'react';
import Papa from "papaparse";

var ReactHighstock = require('react-highcharts/ReactHighstock.src');
class TransactionRateChart extends React.Component{
    constructor(props){
        super(props)
        this.state={
            baseCurrency:'',
            wantedCurrency: '',
            baseCurrencyArray: [],
            wantedCurrencyArray: [],
            rates: [],
            transactions:[]
        };
    }
    componentWillMount(props){
        var csvFilePathRates = require("./../../data/rates.csv");
        var csvFilePathTransactions = require("./../../data/transactions.csv");
        let rates;
        let parsePromise = function(file,timeFieldValue) {
            return new Promise(function(resolve, reject) {
                return Papa.parse(file, {
                    header: true,
                    download: true,
                    complete: function(results) {
                        rates=results.data.map(rateEntry => {
                            if(rateEntry[timeFieldValue]){
                                let time = rateEntry[timeFieldValue].split(":");
                                let date = new Date();
                                date.setHours(time[0]);
                                date.setMinutes(time[1]);
                                date.setSeconds(0);
                                rateEntry[timeFieldValue]=date;}
                            return rateEntry
                        });
                        resolve(rates);
                    }
                })
            });
        };
        parsePromise(csvFilePathRates, "ValidityTime").then(function(results) {
            this.setState({rates:results});
            this.setState({baseCurrency:results[0].BaseCurrency, wantedCurrency:results[0].WantedCurrency})
            this.setState({baseCurrencyArray: [...new Set(this.state.rates.map(rateEntry => rateEntry.BaseCurrency))],
            })
        }.bind(this));
        parsePromise(csvFilePathTransactions,"TransactionTime").then(function(results) {
            this.setState({transactions:results});
        }.bind(this));

    }
    handleBaseCurrencyChange = event => {
        this.setState({baseCurrency:event.target.value})
        let wantedArray = [...new Set(this.state.rates.filter(rateEntry => rateEntry.BaseCurrency === event.target.value).map(filterEntry => filterEntry.WantedCurrency))]
        this.setState({wantedCurrencyArray: wantedArray, wantedCurrency: wantedArray[0]})


    }
    handleWantedCurrencyChange = event => {
        this.setState({wantedCurrency:event.target.value})
    }
    render(){
        let baseCurrency = this.state.baseCurrencyArray;
        let wantedCurrency = [...new Set(this.state.rates.filter(rateEntry => rateEntry.BaseCurrency === this.state.baseCurrency).map(filterEntry => filterEntry.WantedCurrency))]
        if(this.state.baseCurrency && this.state.wantedCurrency){
            var data =this.state.rates.filter(rateEntry => rateEntry.BaseCurrency === this.state.baseCurrency && rateEntry.WantedCurrency === this.state.wantedCurrency)
                .map(filterEntry => {return [filterEntry.ValidityTime.getTime(), parseFloat(filterEntry.rate)]})
        var transactionData = this.state.transactions.filter(transactionEntry => transactionEntry.BaseCurrency === this.state.baseCurrency && transactionEntry.WantedCurrency === this.state.wantedCurrency)
            .map(transaction => {return [transaction.TransactionTime.getTime(),parseFloat(transaction.AmountInBaseCurrency)]})
        }
        let toolTip = `${this.state.baseCurrency}-${this.state.wantedCurrency}`
        var config = {
            type: 'column',
            rangeSelector: {
                selected: 1
            },
            title: {
                text: 'Money Exchange Rate And Transaction'
            },
            time: {
                useUTC: false
            },
            yAxis: [{
                title: {
                    text: 'Amount'
                },
                opposite: false
            },
            {
                title: {
                    text: 'Rate'
                },

            }],
            series: [{
                yAxis:1,
                name: toolTip,
                data: data,
                tooltip: {
                    valueDecimals: 4
                }
            },
                {
                    name: "TrnAmount",
                    data: transactionData,
                    tooltip: {
                        valueDecimals: 2
                    }
                }
            ]
        };
        return <div>
            <div id="currencySelectorContainer">
                BaseCurrency: <select id="baseCurrencySelect" onChange={this.handleBaseCurrencyChange}>
                {baseCurrency.map(baseCur => <option key={baseCur} value={baseCur}>{baseCur}</option>)}
            </select>
                WantedCurrency:<select onChange={this.handleWantedCurrencyChange}>
                {wantedCurrency.map(wantCur => <option key={wantCur} value={wantCur}>{wantCur}</option>)}
            </select>
            </div>
            <ReactHighstock config={config}/>
        </div>
    }
}
export default TransactionRateChart;
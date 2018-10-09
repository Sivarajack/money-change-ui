import React from 'react';
import Papa from "papaparse";
import './RateChart.css';
import ReactHighcharts from 'react-highcharts';
import _ from 'underscore';

var ReactHighstock = require('react-highcharts/ReactHighstock.src');
class RateChart extends React.Component{
    constructor(props){
        super(props)
        this.state={
            baseCurrency:'',
            wantedCurrency: '',
            baseCurrencyArray: [],
            wantedCurrencyArray: [],
            rates: [],
            showAll: false
        };
    }
    componentWillMount(props){
        var csvFilePath = require("./../../data/rates.csv");
        let rates;
        let parsePromise = function(file) {
            return new Promise(function(resolve, reject) {
                return Papa.parse(csvFilePath, {
                    header: true,
                    download: true,
                    complete: function(results) {
                        rates=results.data.map(rateEntry => {
                            if(rateEntry.ValidityTime){
                                let time = rateEntry.ValidityTime.split(":");
                                let date = new Date();
                                date.setHours(time[0]);
                                date.setMinutes(time[1]);
                                date.setSeconds(0);
                                rateEntry.ValidityTime=date;}
                            return rateEntry
                        });
                        resolve(rates);
                    }
                })
            });
        };
        parsePromise(csvFilePath).then(function(results) {
            this.setState({rates:results});
            this.setState({baseCurrency:results[0].BaseCurrency, wantedCurrency:results[0].WantedCurrency})
                this.setState({baseCurrencyArray: [...new Set(this.state.rates.map(rateEntry => rateEntry.BaseCurrency))],
                })
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
    checkboxChangesHandler = event => {
        this.setState({showAll:event.target.checked})
    }
    render(){if(this.state.rates.length!==0){
        let baseCurrency = this.state.baseCurrencyArray;
        let wantedCurrency = [...new Set(this.state.rates.filter(rateEntry => rateEntry.BaseCurrency === this.state.baseCurrency).map(filterEntry => filterEntry.WantedCurrency))]
        if(this.state.baseCurrency && this.state.wantedCurrency){
            var data =this.state.rates.filter(rateEntry => rateEntry.BaseCurrency === this.state.baseCurrency && rateEntry.WantedCurrency === this.state.wantedCurrency)
                .map(filterEntry => {return [filterEntry.ValidityTime.getTime(), parseFloat(filterEntry.rate)]})
        }
        let modifiedRate = _.groupBy(this.state.rates.map(entry=> {let transaction = entry.BaseCurrency+'-'+entry.WantedCurrency;entry.tranasctionEntry=transaction; return entry}),'tranasctionEntry')
        let showAllRateSeries = Object.keys(modifiedRate).map(key=>{ return{name: key, data: modifiedRate[key].map(filterEntry => {return [filterEntry.ValidityTime.getTime(), parseFloat(filterEntry.rate)]})}})
        let toolTip = `${this.state.baseCurrency}-${this.state.wantedCurrency}`
        let showSingleRateSeries = [{
            name: toolTip,
            data: data,
        }]
        let series = this.state.showAll ? showAllRateSeries : showSingleRateSeries

        let config =  {
            chart: {
                type: 'column',
                zoomType: 'xy',
                panning: true,
                panKey: 'shift'
            },
            title: {
                text: 'Money Exchange Rates'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Hours of the Day'
                },
                type: 'datetime',


                dateTimeLabelFormats : {
                    useUTC:false,
                    hour: '%I %p',
                    minute: '%I:%M %p'
                }
            },
            yAxis: {
                title: {
                    text: 'Rate'
                }
            },

            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            time: {
                useUTC: false
            },
        series: series,

            }
        return <div>
            <div id="currencySelectorContainer">
                ShowAllRates: <input type="checkbox" onChange={this.checkboxChangesHandler}/>
                BaseCurrency: <select id="baseCurrencySelect" onChange={this.handleBaseCurrencyChange}>
                {baseCurrency.map(baseCur => <option key={baseCur} value={baseCur}>{baseCur}</option>)}
                </select>
                WantedCurrency:<select onChange={this.handleWantedCurrencyChange}>
                {wantedCurrency.map(wantCur => <option key={wantCur} value={wantCur}>{wantCur}</option>)}
            </select>
            </div>
            <ReactHighcharts config={config}  useUTC="false"/>
        </div>} else {return null}
    }
}
export default RateChart;
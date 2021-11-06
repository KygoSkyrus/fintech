import React, { useState } from 'react';
import Candlestick from './Candlestick';
import './App.css';

const Graph = (props) => {

  const { data, symbol } = props;
  console.log(props);
  console.log(data);

  if (data.length >= 1) {
    return (
      <Candlestick data={data} symbol={symbol} />
    )
  } else {
    return <div className="chart-alternate"></div>;
  }
}



function App() {

  const [data, setdata] = useState({});
  const [symbol, setsymbol] = useState();
  const [timeZone, settimeZone] = useState();
  const [info, setinfo] = useState();
  const apiKey = "XZOG02EWJKHIHJ2Z";

  const [symbols, setsymbols] = useState([]);


  function parseObjectKeys(obj) {
    for (var prop in obj) {
      //console.log(prop)
      var sub = obj[prop]
      if (typeof (sub) == "object") {
        if (prop === "Meta Data") {
          setsymbol(sub["2. Symbol"]);
          settimeZone(sub["5. Time Zone"]);
          //getSymbol();
        }

        parseObjectKeys(sub);
      }
    }
  }


  const getSymbol = () => {

    const symb = document.getElementById("symbol").value.toString().toUpperCase();
    const datalist = document.getElementById("symbols");

    console.log(symb);

    if (symb.length >= 1) {
      fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symb}&apikey=6Z21T8D7HL8Z2JGM`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setsymbols(data.bestMatches);
        });
    }
  }

  console.log(symbols);



  const getData = () => {

    const symb = document.getElementById("symbol").value.toString().toUpperCase();
    console.log(symb);
    const selected = document.getElementById("select").value;

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_${selected}&symbol=${symb}&apikey=${apiKey}`;


    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {

        console.log(data);
        if (data.Note === "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency." || data["Error Message"] === "Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY.") {
          console.log("API limit reached, try again in a minute!!!")

        } else {
          parseObjectKeys(data);
          setInfoData(symb);
          if (selected === "DAILY") {
            setdata(formatdata(data['Time Series (Daily)']));
            console.log(data);
          } else if (selected === "WEEKLY") {
            setdata(formatdata(data['Weekly Time Series']));
          } else if (selected === "MONTHLY") {
            setdata(formatdata(data['Monthly Time Series']));
          }
        }

      })
  }



  function formatdata(data) {
    // Convert data from an object to an array
    return Object.entries(data).map(entries => {
      const [date, priceData] = entries;

      return {
        date,
        open: Number(priceData['1. open']),
        high: Number(priceData['2. high']),
        low: Number(priceData['3. low']),
        close: Number(priceData['4. close'])
      }
    });
  }

  const setInfoData = (s) => {

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${s}&apikey=IVKQJTLVOXVEB51T`;

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data.bestmatches);
        if (data !== undefined) {
          data.bestMatches.map(x => x["1. symbol"] == s ? setinfo(x) : null)
        }
      })
  }


  return (
    <div className="app">

      <div className="left">
        <h1 className="mb-4">ROCK STOCK</h1>

        <div className="mb-3">
          <label htmlFor="browser">Enter stock symbol:</label>
          <input type="text" id="symbol" name="symbol" list="symbols" onInput={() => getSymbol()} placeholder="Enter symbol" autoComplete="off" required className="form-control" />

          <datalist id="symbols">
            {symbols === undefined ? null :
              symbols.map(x => <option value={x["1. symbol"]} key={x["1. symbol"]} >{x["2. name"]}</option>)}
          </datalist>
        </div>

        <div className="mb-3">
          <label htmlFor="ts">Timeseries : </label>
          <select name="select" id="select" className="form-select">
            <option value="">--Choose a timeseries--</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>

        <button onClick={() => getData()} type="submit" value="submit" className="btn btn-outline-secondary w-100 text-dark ">SHOW</button>


        {info ?
          <div className="lh-1">
            <p>Symbol : {symbol}</p>
            <p>name : {info["2. name"]}</p>
            <p>type : {info["3. type"]}</p>
            <p>Region : {info["4. region"]}</p>
            <p>marketOpen : {info["5. marketOpen"]}</p>
            <p>marketClose : {info["6. marketClose"]}</p>
            <p>Time zone : {timeZone}</p>
            <p>currency : {info["8. currency"]}</p>
          </div>
          : null
        }

      </div>

      <div className="chart">
        <Graph data={data} symbol={symbol} />
      </div>
    </div>
  );
}

export default App;
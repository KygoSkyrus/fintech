import React, { useState } from 'react';
import Candlestick from './Candlestick';
import './App.css';

function App() {

  const [data, setdata] = useState({});
  const [symbol, setsymbol] = useState();
  const [timeZone, settimeZone] = useState();
  const apiKey = "XZOG02EWJKHIHJ2Z";

  const [symbols, setsymbols] = useState([]);

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      getData();
    }
  }

  const getData = () => {

    const symb = document.getElementById("symbol").value.toString().toUpperCase();
    const selected = document.getElementById("select").value;


    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_${selected}&symbol=${symb}&apikey=${apiKey}`;


    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        parseObjectKeys(data);
        if (selected === "DAILY") {
          setdata(formatdata(data['Time Series (Daily)']));
        } else if (selected === "WEEKLY") {
          setdata(formatdata(data['Weekly Time Series']));
        } else if (selected === "MONTHLY") {
          setdata(formatdata(data['Monthly Time Series']));
        }
      })
  }

  function parseObjectKeys(obj) {
    for (var prop in obj) {
      //console.log(prop)
      var sub = obj[prop]
      if (typeof (sub) == "object") {
        if (prop === "Meta Data") {
          setsymbol(sub["2. Symbol"]);
          settimeZone(sub["5. Time Zone"]);
          getSymbol();
        }

        parseObjectKeys(sub);
      }
    }
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

  function getSymbol() {
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=apple&apikey=${apiKey}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        data.bestMatches.map(r => console.log(r["1. symbol"]))
        setsymbols(data.bestMatches);
        //console.log(data.bestMatches);
      });
  }

  console.log(symbols);


  return (
    <div className="app">
      <p>Symbol : {symbol}</p>
      <p>Time zone : {timeZone}</p>

     
        <label htmlFor="browser">Enter stock symbol:</label>
        <input type="text" id="symbol" name="symbol" list="symbols" onKeyDown={handleKeyDown} required onInput={() => getSymbol()}/>  
        <datalist id="symbols">
          {symbols.map(x=> <option value={x["1. symbol"]} key={x["1. symbol"]} /> )}
        </datalist>

        <div>
          <label htmlFor="ts">Choose a timeseries : </label>

          <select name="select" id="select">
            <option value="">--Please choose an option--</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
        <button onClick={() => getSymbol()} type="submit" value="submit" >show</button>
      

      <div className="chart">
        {data.length > 0 ?
          <Candlestick data={data} symbol={symbol} /> : null}
      </div>
    </div>
  );
}

export default App;
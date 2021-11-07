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
  const [info, setinfo] = useState();
  const [warning, setwarning] = useState(false);
  const apiKey = "XZOG02EWJKHIHJ2Z";


  const [symbols, setsymbols] = useState([]);


  function parseObjectKeys(obj) {
    for (var prop in obj) {
      //console.log(prop)
      var sub = obj[prop]
      if (typeof (sub) == "object") {
        if (prop === "Meta Data") {
          setsymbol(sub["2. Symbol"]);

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
          setwarning(true);
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

    if (s == "") {
      return null;
    } else {
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
  }


  return (
    <>
      <div className="app">

        <div className="left">
          <h1 className="mb-4">ROCK STOCK</h1>

            <div className="mb-3">
              <label htmlFor="browser">Enter stock symbol:</label>
              <input type="text" id="symbol" name="symbol" list="symbols" onInput={() => getSymbol()} placeholder="for e.g. 'TSLA'" autoComplete="off" required className="form-control" />

              <datalist id="symbols">
                {symbols === undefined ? null :
                  symbols.map(x => <option value={x["1. symbol"]} key={x["1. symbol"]} >{x["2. name"]}</option>)}
              </datalist>
            </div>

            <div className="mb-3">
              <label htmlFor="ts">Timeseries : </label>
              <select name="select" id="select" className="form-select" placeholder="--Choose a timeseries--" required>
                <option value="">--Choose a timeseries--</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            <button onClick={() => getData()} type="submit" className="btn btn-outline-secondary w-100 text-dark ">SHOW</button>


          {info ?
            <div className="info">
              <table className="">
                <tr>
                  <td>Name</td>
                  <td>{info["2. name"]}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{info["3. type"]}</td>
                </tr>
                <tr>
                  <td>Region</td>
                  <td>{info["4. region"]}</td>
                </tr>
                <tr>
                  <td>Marketopen</td>
                  <td>{info["5. marketOpen"]}</td>
                </tr>
                <tr>
                  <td>Marketclose</td>
                  <td>{info["6. marketClose"]}</td>
                </tr>
                <tr>
                  <td>Timezone</td>
                  <td>{info["7. timezone"]}</td>
                </tr>
                <tr>
                  <td>Currency</td>
                  <td>{info["8. currency"]}</td>
                </tr>
              </table>
            </div>
            : null
          }

        </div>

        <div id="line"></div>
        <div className="chart">
        <Graph data={data} symbol={symbol} />
        </div>
      </div>

      {warning ?
        <div className="alert alert-danger alert-dismissible fade show error" role="alert">
          <i class="fa fa-exclamation-triangle"></i>
          &nbsp; <strong>API limit reached!!! </strong> Try again in a minute
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        : null
      }
    </>
  );
}

export default App;
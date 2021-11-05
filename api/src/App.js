import React, { useState } from 'react';
import Candlestick from './Candlestick';
import './App.css';

const Graph=(props)=>{

const {data,symbol}=props;
console.log(props);
console.log(data);

if(data.length>=1){
  return (
   <Candlestick data={data} symbol={symbol} />
  )
}else{
  return null;
}
  
}



function App() {

  const [data, setdata] = useState({});
  const [symbol, setsymbol] = useState();
  const [timeZone, settimeZone] = useState();
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
    //const datalist = document.getElementById("symbols");

    console.log(symb);

    if (symb.length >= 1) {
      fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symb}&apikey=${apiKey}`)
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
        //stop it if the response is undefined
        console.log(data)
        parseObjectKeys(data);
        if (selected === "DAILY") {
          setdata(formatdata(data['Time Series (Daily)']));
          console.log(data);
        } else if (selected === "WEEKLY") {
          setdata(formatdata(data['Weekly Time Series']));
        } else if (selected === "MONTHLY") {
          setdata(formatdata(data['Monthly Time Series']));
        }
      })
  }
 // "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency."
  function formatdata(data) {
    console.log(typeof data);
    // Convert data from an object to an array
if(typeof data===undefined){
  console.log("stopping here")
}else{
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
  }


  return (
    <div className="app">
      <p>Symbol : {symbol}</p>
      <p>Time zone : {timeZone}</p>

      <label htmlFor="browser">Enter stock symbol:</label>
      <input type="text" id="symbol" name="symbol" list="symbols" onInput={() => getSymbol()} placeholder="enter symbol" autoComplete="off" required />
      <datalist id="symbols">
        {symbols===undefined ? null : symbols.map(x => <option value={x["1. symbol"]} key={x["1. symbol"]} />)}
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
      <button onClick={() => getData()} type="submit" value="submit" >show</button>


      <div className="chart">
      <Graph data={data} symbol={symbol}/>
      </div>
    </div>
  );
}

export default App;


/*

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


  function formatdata(data) {
    console.log(data);
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


 async function  getSymbol() {
    const symb = document.getElementById("symbol").value.toString().toUpperCase();
    const datalist = document.getElementById("symbols");
    console.log(symb);

    if (symb.length >= 1) {
     await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symb}&apikey=${apiKey}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {



          console.log("symbols : " + symbols);
          //console.log("symbols typeof:"+ symbols.typeOf());


          // if (data.bestmatches === undefined) {
          //   console.log("null runs");
          //     var z = document.createElement('option');
          //     z.value = "no data found";
          //     datalist.appendChild(z);
          // }
          if(data.bestMatches===undefined){
            console.log("is undefined");
          }else{
            //data.bestMatches.map(r => {

              console.log("map runs");
              //console.log(r);
              //let option=`<option value={x["1. symbol"]} key={x["1. symbol"]} />`;
              //var z = document.createElement('option');
              //z.value = r["1. symbol"];
              //datalist.appendChild(z);
              setsymbols(data.bestMatches);
            //})
          }
          //setsymbols(data.bestMatches);
          //console.log(data.bestMatches);
        });
    }

  }

  console.log(symbols);


  return (
    <div className="app">
      <p>Symbol : {symbol}</p>
      <p>Time zone : {timeZone}</p>


      <label htmlFor="browser">Enter stock symbol:</label>
      <input type="text" id="symbol" name="symbol" list="symbols" onKeyDown={handleKeyDown} onInput={() => getSymbol()} placeholder="enter symbol" required autoComplete="off" />
      <datalist id="symbols">
        {symbols.map(x => <option value={x["1. symbol"]} key={x["1. symbol"]} />)}
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
      <button onClick={() => getData()} type="submit" value="submit" >show</button>


      <div className="chart">
        {data.length >=1 ?
          <Candlestick data={data} symbol={symbol} /> : null}
      </div>
    </div>
  );
}

export default App;
*/
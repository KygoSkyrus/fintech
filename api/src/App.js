import React, { useEffect, useState } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import './App.css';

function App() {

  const [data, setdata] = useState({});
  const [symbol, setsymbol] = useState();
  const [timeZone, settimeZone] = useState();


  function handleKeyDown(e){
    if (e.key === 'Enter') {
      getData();
    }
  }

  const getData = () => {

    const symb = document.getElementById("symbol").value.toString().toUpperCase();

    const apiKey = "XZOG02EWJKHIHJ2Z";

    const daily = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symb}&apikey=${apiKey}`;

    const intraday = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symb}&interval=5min&apikey=${apiKey}`;

    fetch(daily)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        parseObjectKeys(data);
        const timeseries = data['Time Series (Daily)'];
        //console.log(timeseries);
        setdata(formatdata(timeseries));
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
        }

        parseObjectKeys(sub);
      }
    }
  }

  //console.log(data);
  //console.log(data["Meta Data"]["1. Symbol"]);



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


  return (
    <div className="App">
      <p>Symbol : {symbol}</p>
      <p>Time zone : {timeZone}</p>

      <input type="text" id="symbol" onKeyDown={handleKeyDown}/>
      <button onClick={() => getData()}>show</button>

      {data.length === 100 ?
        <CanvasJSChart
          options={{
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: `${symbol} Stock Price `
            },
            axisY: {
              // Minimum value is 10% less than the lowest price in the dataset
              minimum: Math.min(...data.map(data => data.low)) / 1.1,
              // Minimum value is 10% more than the highest price in the dataset
              maximum: Math.max(...data.map(data => data.high)) * 1.1,
              crosshair: {
                enabled: true,
                snapToDataPoint: true
              }
            },
            axisX: {
              crosshair: {
                enabled: true,
                snapToDataPoint: true
              },
              scaleBreaks: {
                spacing: 0,
                fillOpacity: 0,
                lineThickness: 0,
                customBreaks: data.reduce((breaks, value, index, array) => {
                  // Just return on the first iteration
                  // Since there is no previous data point
                  if (index === 0) return breaks;

                  // Time in UNIX for current and previous data points
                  const currentDataPointUnix = Number(new Date(value.date));
                  const previousDataPointUnix = Number(new Date(array[index - 1].date));

                  // One day converted to milliseconds
                  const oneDayInMs = 86400000;

                  // Difference between the current and previous data points
                  // In milliseconds
                  const difference = previousDataPointUnix - currentDataPointUnix;

                  return difference === oneDayInMs
                    // Difference is 1 day, no scale break is needed
                    ? breaks
                    // Difference is more than 1 day, need to create
                    // A new scale break
                    : [
                      ...breaks,
                      {
                        startValue: currentDataPointUnix,
                        endValue: previousDataPointUnix - oneDayInMs
                      }
                    ]
                }, [])
              }
            },
            data: [
              {
                type: 'candlestick',
                showInLegend: true,
				        name: `${symbol} Stocks`,
                dataPoints: data.map(data => ({
                  x: new Date(data.date),
                  // The OHLC for the data point
                  // The order is IMPORTANT!
                  y: [
                    data.open,
                    data.high,
                    data.low,
                    data.close
                  ]
                }))
              }
            ]
          }}
        /> : null}

    </div>
  );
}

export default App;
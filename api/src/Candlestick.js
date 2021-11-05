import React from 'react'
import { CanvasJSChart } from 'canvasjs-react-charts';

const Candlestick = (props) => {
    const {data, symbol}=props;
    return (
        <CanvasJSChart
        options={{
          theme: "light2", // "light1", "light2", "dark1", "dark2"
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: ""
          },
          subtitles: [{
            text: ""
          }],
          axisY: {
            prefix: "$",
		    		title: "Price (in USD)",

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
      />
    )
}

export default Candlestick

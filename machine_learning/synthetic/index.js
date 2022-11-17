const Plotly = require("plotly")("Hamza_Ibrahim", "Voo0kLzPEQRyKhvrs0oJ");
const { predictions } = require("./message.js");
const { default: axios } = require("axios");

async function main() {
  const originalData = (
    await axios.get(
      "https://kdnuy5xec7.execute-api.us-east-1.amazonaws.com/prod/M00737296"
    )
  ).data;
  const { mean, quantiles } = predictions.predictions[0];
  const trace1 = {
    x: originalData.target.map((x, i) => i),
    y: originalData.target,
    type: "scatter",
    name: "Original",
  };
  const trace2 = {
    x: [...originalData.target, ...mean].map((x, i) => i),
    y: [...originalData.target, ...mean],
    type: "scatter",
    name: "Mean",
  };
  const trace3 = {
    x: [...originalData.target, ...quantiles["0.1"]].map((x, i) => i),
    y: [...originalData.target, ...quantiles["0.1"]],
    type: "scatter",
    name: "0.1 Quantile",
  };
  const trace4 = {
    x: [...originalData.target, ...quantiles["0.9"]].map((x, i) => i),
    y: [...originalData.target, ...quantiles["0.9"]],
    type: "scatter",
    name: "0.9 Quantile",
  };
  const data = [trace1, trace2, trace3, trace4];
  const results = await plotData(data, graphOptions);
  console.log(results)
}

main();
const layout = {
  title: "Synthetic Data for Student ID: M00737296",
  width: 900,
  height: 500,
  font: {
    size: 10,
  },
  xaxis: {
    title: "Time (hours) ",
  },
  yaxis: {
    title: "Value",
  },
};
const graphOptions = {
  layout: layout,
  filename: "date-axes",
  fileopt: "overwrite",
};

async function plotData(data, graphOptions) {
  return new Promise((resolve, reject) => {
    Plotly.plot(data, graphOptions, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
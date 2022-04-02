import "./styles.css";
import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ScatterChart from "./components/ScatterChart";
import CSVInput from "./components/CSVInput";
import { parse } from "papaparse";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
); //registering plugins

export default function App() {
  //function passed down to CSVinput component
  function handleInput(e) {
    parse(e.target.files[0], {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData({
          //Parsed CSV data is used to update data state
          labels: results.data.map((item) => item.time % results.data[0].time), // x axis labels - reduces time to 0-10 sec
          datasets: [
            {
              label: "C1",
              data: results.data.map((item) => item.c1),
              backgroundColor: ["rgba(255, 99, 132, 0.5)"],
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: "C2",
              data: results.data.map((item) => item.c2),
              backgroundColor: ["rgba(53, 162, 235, 0.5)"],
              borderColor: "rgba(53, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "C3",
              data: results.data.map((item) => item.c3),
              backgroundColor: ["rgba(255,205,86,0.5)"],
              borderColor: "rgb(255,205,86)",
              borderWidth: 1,
            },
            {
              label: "C4",
              data: results.data.map((item) => item.c4),
              backgroundColor: ["rgba(75,192,192,0.5)"],
              borderColor: "rgb(75,192,192)",
              borderWidth: 1,
            },
          ],
        });
      },
    });
  }

  //State for the time data prop
  const [data, setData] = React.useState({
    //initial state has empty fields as placeholders
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });

  function calcMagnitude(a, b) {
    return Math.sqrt(a * a + b * b);
  }

  //frequency conversion
  var fft = require("fft-js").fft;

  //Updates freq data when time data changes
  React.useEffect(() => {
    if (data.datasets.length < 2) return; //Wait until the user input a CSV with actual data

    //Convert time to frequency domain with FFT
    const timeData = data.datasets.map((dataset) => {
      return dataset.data.map((element) => parseFloat(element));
    });

    const phasors = timeData.map((element) => fft(element.slice(0, 2048))); //FFT only works with 2^n sized arrays

    const fWeights = phasors.map((phasor) =>
      phasor.map((complexNum) => calcMagnitude(complexNum[0], complexNum[1]))
    );
    console.log(fWeights);

    //Converting indices to corresponding frequencies to plot as x-axis
    const indices = Array.from(Array(fWeights[0].length + 1).keys());
    const frequencies = indices.map((index) => index / 10);
    console.log(frequencies);
    setFData({
      labels: frequencies, // x axis labels
      datasets: [
        {
          label: "C1",
          data: fWeights[0],
          backgroundColor: ["rgba(255, 99, 132, 0.5)"],
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "C2",
          data: fWeights[1],
          backgroundColor: ["rgba(53, 162, 235, 0.5)"],
          borderColor: "rgba(53, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "C3",
          data: fWeights[2],
          backgroundColor: ["rgba(255,205,86,0.5)"],
          borderColor: "rgb(255,205,86)",
          borderWidth: 1,
        },
        {
          label: "C4",
          data: fWeights[3],
          backgroundColor: ["rgba(75,192,192,0.5)"],
          borderColor: "rgb(75,192,192)",
          borderWidth: 1,
        },
      ],
    });
  }, [data]);

  //State for the frequency data prop
  const [fData, setFData] = React.useState({
    //initial state has empty fields as placeholders
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });

  //options props
  const timeTitles = {
    main: "Electrical Brain Signals vs Time",
    xaxis: "Time [s]",
    yaxis: "Electrical Activity [μV]",
  };

  const freqTitles = {
    main: "Electrical Brain Signals vs Frequency",
    xaxis: "Frequency [Hz]",
    yaxis: "Amplitude",
  };

  return (
    <div className="App">
      <div>
        <CSVInput handleInput={handleInput} />
        <ScatterChart chartData={data} titles={timeTitles} />
        <br></br>
        <hr></hr>
        <br></br>
        <ScatterChart chartData={fData} titles={freqTitles} />
      </div>
    </div>
  );
}

import "./styles.css";
import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  LogarithmicScale,
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
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
); //registering plugins

export default function App() {
  //function passed down to CSVinput component
  function handleCSVInput(e) {
    parse(e.target.files[0], {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(e.target.files[0].name);
        selectCurrentData(results.data);
      },
    });
  }

  //Given array of data, sets the data state
  function selectCurrentData(data) {
    console.log("function ran");
    setData({
      //Parsed CSV data is used to update data state
      labels: data.map((item) => item.time % data[0].time), // x axis labels - reduces time to 0-10 sec
      datasets: [
        {
          label: "C1",
          data: data.map((item) => item.c1),
          backgroundColor: ["rgba(255, 99, 132, 0.5)"],
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "C2",
          data: data.map((item) => item.c2),
          backgroundColor: ["rgba(53, 162, 235, 0.5)"],
          borderColor: "rgba(53, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "C3",
          data: data.map((item) => item.c3),
          backgroundColor: ["rgba(255,205,86,0.5)"],
          borderColor: "rgb(255,205,86)",
          borderWidth: 1,
        },
        {
          label: "C4",
          data: data.map((item) => item.c4),
          backgroundColor: ["rgba(75,192,192,0.5)"],
          borderColor: "rgb(75,192,192)",
          borderWidth: 1,
        },
      ],
    });
  }

  //State for file explorer side panel
  const [folderFiles, setFolderFiles] = React.useState({});

  function fileClick(e) {
    console.log(e.target.innerText);
    const CSVData = folderFiles[e.target.innerText].data.data;
    selectCurrentData(CSVData);
  }

  //For every csv file in folder state, create a file component in sidebar file explorer
  const fileListComponents = Object.keys(folderFiles).map((filepath) => {
    return (
      <li key={filepath} onClick={fileClick} className="folder-file">
        {filepath}
      </li>
    );
  });

  //Take folder as input and get info from each file within it
  function folderInput(e) {
    const files = e.target.files;

    //loops through all files in folder and parses CSV data
    let folderData = {};
    for (let i = 0; i < files.length; i++) {
      let file = files.item(i);
      parse(file, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          //Filters out filetypes that are not CSV
          if (file.type === "text/csv") {
            folderData[file.webkitRelativePath] = { file: file, data: results };
          }
          if (i === files.length - 1) {
            //code to run when all files are parsed
            setFolderFiles(folderData);
          }
        },
      });
    }
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

  //frequency conversion
  var fft = require("fft-js").fft;

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

  //Helper function for frequency conversion.
  function calcMagnitude(a, b) {
    return Math.sqrt(a * a + b * b);
  }

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
    // console.log(fWeights);

    //Converting indices to corresponding frequencies to plot as x-axis
    const indices = Array.from(Array(fWeights[0].length + 1).keys());
    const frequencies = indices.map((index) => index / 10);
    // console.log(frequencies);
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
        <CSVInput handleInput={handleCSVInput} />
        {/* <iframe
          src="https://drive.google.com/embeddedfolderview?id=14a7O2lfUv0aVyjHa1gkY2KH_Aej_sis4"
          width="600"
          height="500"
          frameBorder="0"
        ></iframe> */}
        <input
          type="file"
          id="folder-input"
          onChange={folderInput}
          directory=""
          webkitdirectory=""
          multiple
        />
        <div className="flex-container">
          <div id="folder">
            <ul className="folder-list">{fileListComponents}</ul>
          </div>
          <div className="chart-container">
            <ScatterChart chartData={data} titles={timeTitles} />
            <ScatterChart chartData={fData} titles={freqTitles} />
          </div>
        </div>
      </div>
    </div>
  );
}

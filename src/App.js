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
import SideBar from "./components/SideBar";
import SidePanel from "./components/SidePanel";
ChartJS.register(
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
); //registering plugins
//frequency conversion
var fft = require("fft-js").fft;

export default function App() {
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

  //Given array of data, sets the data state - passed down to file explorer component
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

    //finding closest power of 2 to the length of the data array
    let sizePowerOf2 = timeData[0].length >= 2048 ? 2048 : 1024;
    const phasors = timeData.map((element) =>
      fft(element.slice(0, sizePowerOf2))
    ); //FFT only works with 2^n sized arrays

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

  //Shows different panels depending on which sidebar button clicked
  const [showSidePanel, setShowSidePanel] = React.useState(true);

  function toggleSidePanel() {
    setShowSidePanel((prevState) => {
      console.log("clicked");
      return !prevState;
    });
  }

  const [currentSidePanel, setCurrentSidePanel] =
    React.useState("File Explorer");

  function setPanel(panel) {
    if (!showSidePanel) {
      setCurrentSidePanel(panel);
      toggleSidePanel();
    } else if (currentSidePanel === panel) {
      toggleSidePanel();
    } else {
      setCurrentSidePanel(panel);
    }
    console.log(panel);
  }

  //State for title of whatever graph is current displayed
  const [title, setTitle] = React.useState(
    "Upload a CSV file from your computer or browse the Gallery of datasets!"
  );

  return (
    <div className="text-center flex">
      <SideBar click={setPanel} />
      {showSidePanel && (
        <SidePanel
          currentPanel={currentSidePanel}
          selectCurrentData={selectCurrentData}
          folderFiles={folderFiles}
          setFolderFiles={setFolderFiles}
          setTitle={setTitle}
        />
      )}
      <div className="flex flex-col flex-grow h-screen p-7 overflow-auto border-none">
        <h1 className="text-3xl">{title}</h1>
        <ScatterChart chartData={data} titles={timeTitles} />
        <ScatterChart chartData={fData} titles={freqTitles} />
      </div>
    </div>
  );
}

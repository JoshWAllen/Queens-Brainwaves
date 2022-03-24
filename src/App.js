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
); //Not sure why this needs to be included

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

  //State for the data prop
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

  //State for the options prop
  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Electrical Brain Signals vs Time",
        font: {
          size: 25,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Time [s]",
          font: {
            size: 20,
          },
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Electrical Activity [μV]",
          font: {
            size: 20,
          },
        },
      },
    },
  };

  console.log(data);

  return (
    <div className="App">
      <div>
        <CSVInput handleInput={handleInput} />
        <ScatterChart chartData={data} options={options} />
      </div>
    </div>
  );
}

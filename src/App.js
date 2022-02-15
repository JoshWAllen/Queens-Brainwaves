import "./styles.css";
import React from "react";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import UserData from "./Data";

export default function App() {
  const [data, setData] = React.useState({
    labels: UserData.map((item) => item.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((item) => item.userGain),
        backgroundColor: ["#11335d", "#eebd31", "#9d1939"],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  return (
    <div className="App">
      <div style={{ width: 700 }}>
        <BarChart chartData={data} />
        <LineChart chartData={data} />{" "}
      </div>
    </div>
  );
}

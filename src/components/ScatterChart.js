import React from "react";
import { Scatter } from "react-chartjs-2";

function ScatterChart({ chartData, options }) {
  return (
    <>
      <Scatter data={chartData} options={options} />
    </>
  );
}

export default ScatterChart;

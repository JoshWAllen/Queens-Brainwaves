import React from "react";
import { Scatter } from "react-chartjs-2";

function ScatterChart({ chartData, titles }) {
  //Options must be passed as props to charts
  const [options, setOptions] = React.useState({
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: titles.main,
        font: {
          size: 25,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: false,
        min: undefined,
        max: undefined,
        title: {
          display: true,
          text: titles.xaxis,
          font: {
            size: 20,
          },
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: titles.yaxis,
          font: {
            size: 20,
          },
        },
      },
    },
  });

  //State to keep controlled components - must be strings to avoid controlled component errors
  const [formData, setFormData] = React.useState({
    xmin: "",
    xmax: "",
  });

  console.log(formData.xmin);
  console.log(options);

  //When form state changes, update options state accordingly
  React.useEffect(() => {
    setOptions((prevOptions) => {
      return {
        //Keep the Options object exact same except for changes to scales (uses JS spread operator)
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          x: {
            ...prevOptions.scales.x,
            min: typeof formData.xmin == "number" ? formData.xmin : undefined,
            max: typeof formData.xmax == "number" ? formData.xmax : undefined,
          },
        },
      };
    });
  }, [formData]);

  //Set scales back to default and empty forms
  function resetScales() {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        xmin: "",
        xmax: "",
      };
    });
  }

  //Called every time xmin or xmax input box changes - updates form state
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]:
          event.target.value === "" ? "" : parseInt(event.target.value),
      };
    });
  }

  return (
    <>
      <Scatter data={chartData} options={options} />

      <label htmlFor="xmin">x-min:</label>
      <input
        type="number"
        id="xmin"
        name="xmin"
        onChange={handleChange}
        value={formData.xmin}
      />

      <label htmlFor="xmax">x-max:</label>
      <input
        type="number"
        id="xmax"
        name="xmax"
        onChange={handleChange}
        value={formData.xmax}
      />

      <button onClick={resetScales}>Reset Scales</button>
    </>
  );
}

export default ScatterChart;

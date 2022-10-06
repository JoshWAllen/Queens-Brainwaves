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
          size: 20,
        },
      },
    },
    // animation: {
    //   duration: 0, // general animation time
    // },
    hover: {
      animationDuration: 0, // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
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
        type: "linear",
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

  //Changes y axis between linear and log scaling
  function toggleLog() {
    setOptions((prevOptions) => {
      return {
        //Keep the Options object exact same except for changes to scales (uses JS spread operator)
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          y: {
            ...prevOptions.scales.y,
            type:
              prevOptions.scales.y.type === "linear" ? "logarithmic" : "linear",
          },
        },
      };
    });
  }

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
    <div className="mt-20">
      <Scatter data={chartData} options={options} />
      <div className="flex justify-center items-center w-full gap-3">
        <button
          onClick={toggleLog}
          className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white 
        transition-all duration-400 border border-transparent rounded-md focus:outline-none 
        bg-cyan-600 active:bg-cyan-400 hover:bg-cyan-500"
        >
          Log y-axis
        </button>
        <h4>{options.scales.y.type} scale</h4>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          x-min:
          <input
            type="number"
            id="xmin"
            name="xmin"
            onChange={handleChange}
            value={formData.xmin}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
            leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          x-max:
          <input
            type="number"
            id="xmax"
            name="xmax"
            onChange={handleChange}
            value={formData.xmax}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
            leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>

        <button
          onClick={resetScales}
          className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white 
        transition-all duration-400 border border-transparent rounded-md focus:outline-none 
        bg-cyan-600 active:bg-cyan-400 hover:bg-cyan-500"
        >
          Reset Scales
        </button>
      </div>
    </div>
  );
}

export default ScatterChart;

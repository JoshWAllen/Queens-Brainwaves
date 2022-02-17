import React from "react";
import { parse } from "papaparse";

export default function CSVInput() {
  const [data, setData] = React.useState(0);

  console.log(data);

  function handleInput(e) {
    console.log(e.target);
    parse(e.target.files[0], {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results);
      }
    });
  }

  return (
    <div>
      <input
        name="file"
        className="inputfile"
        id="file"
        type="file"
        accept=".csv"
        onChange={handleInput}
      />
      <label htmlFor="file">Choose a file</label>
    </div>
  );
}

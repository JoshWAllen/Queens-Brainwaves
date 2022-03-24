import React from "react";

export default function CSVInput(props) {
  return (
    <div>
      <input
        name="file"
        className="inputfile"
        id="file"
        type="file"
        accept=".csv"
        onChange={props.handleInput}
      />
      <label htmlFor="file">Choose a file</label>
    </div>
  );
}

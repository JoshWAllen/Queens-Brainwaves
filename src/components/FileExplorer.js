import React from "react";
import { parse } from "papaparse";
import { AiFillFolderAdd, AiFillFileAdd } from "react-icons/ai";
import { FaFileCsv } from "react-icons/fa";

const FileExplorer = ({
  selectCurrentData,
  folderFiles,
  setFolderFiles,
  setTitle,
}) => {
  //runs when individual file picker button is clicked.
  function handleCSVInput(e) {
    const file = e.target.files[0];
    parse(file, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results.data);
        setTitle(file.name);
        selectCurrentData(results.data);
        setFolderFiles({
          [file.name]: { file: file, data: results },
        });
      },
    });
  }

  //runs when file in folder sidebar is clicked
  function fileClick(e) {
    setTitle(e.target.innerText);
    const CSVData = folderFiles[e.target.innerText].data.data;
    selectCurrentData(CSVData);
  }

  //For every csv file in folder state, create a file component in sidebar file explorer
  const fileListComponents = Object.keys(folderFiles).map((filepath) => {
    return (
      <li
        key={filepath}
        onClick={fileClick}
        className="flex items-center justify-start text-left text-base p-2 hover:cursor-pointer hover:bg-cyan-700"
      >
        <FaFileCsv size="15" className="min-w-min" />
        <span>{filepath}</span>
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
          console.log(file.type);
          // Filters out filetypes that are not CSV
          if (
            file.type === "text/csv" ||
            file.type === "application/vnd.ms-excel"
          )
            // seemed to cause issues on firefox
            folderData[file.webkitRelativePath] = { file: file, data: results };

          if (i === files.length - 1) setFolderFiles(folderData); //runs when all files are parsed
        },
      });
    }
  }

  return (
    <div>
      <div className="flex flex-row gap-1 items-center justify-evenly mx-1">
        <label className="flex items-center justify-center w-32 my-6 font-bold p-4 text-white rounded-md bg-cyan-600 hover:bg-cyan-500">
          <AiFillFileAdd size="20" />
          Add File
          <input
            name="file"
            className="w-0 h-0 opacity-0 overflow-hidden absolute -z-10"
            type="file"
            id="file"
            onChange={handleCSVInput}
            accept=".csv"
          />
        </label>
        <label className="flex items-center justify-center w-32 my-6 font-bold p-4 text-white rounded-md bg-cyan-600 hover:bg-cyan-500">
          <AiFillFolderAdd size="20" />
          Add Folder
          <input
            name="folder"
            className="w-0 h-0 opacity-0 overflow-hidden absolute -z-10"
            type="file"
            id="folder-input"
            onChange={folderInput}
            directory=""
            webkitdirectory=""
            multiple
          />
        </label>
      </div>
      <ul>{fileListComponents}</ul>
    </div>
  );
};

export default FileExplorer;

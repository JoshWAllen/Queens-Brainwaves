//Will switch between file explorer, history view and more
import React from "react";
import FileExplorer from "./FileExplorer";
import Gallery from "./Gallery";

const SidePanel = ({
  currentPanel,
  selectCurrentData,
  folderFiles,
  setFolderFiles,
  setTitle,
}) => {
  return (
    <div className="h-screen w-72 bg-cyan-900 text-xs overflow-auto text-gray-100">
      {currentPanel === "File Explorer" && (
        <FileExplorer
          selectCurrentData={selectCurrentData}
          folderFiles={folderFiles}
          setFolderFiles={setFolderFiles}
          setTitle={setTitle}
        />
      )}
      {currentPanel === "Gallery" && (
        <Gallery selectCurrentData={selectCurrentData} setTitle={setTitle} />
      )}
      {currentPanel === "Account" && (
        <h1 className="my-3 text-base">Account capabilities coming soon</h1>
      )}
      {currentPanel === "Settings" && (
        <h1 className="my-3 text-base">Settings capabilities coming soon</h1>
      )}
    </div>
  );
};

export default SidePanel;

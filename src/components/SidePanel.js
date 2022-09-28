//Will switch between file explorer, history view and more
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import FileExplorer from "./FileExplorer";
import Gallery from "./Gallery";
// import "./resize.css";

const SidePanel = ({
  currentPanel,
  selectCurrentData,
  folderFiles,
  setFolderFiles,
  setTitle,
}) => {
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(268);

  const startResizing = useCallback((mouseDownEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        setSidebarWidth(
          mouseMoveEvent.clientX -
            sidebarRef.current.getBoundingClientRect().left
        );
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div
      ref={sidebarRef}
      className="flex-grow-0 flex-shrink-0 min-w-min max-w-lg flex flex-row bg-white z-10"
      // className="app-sidebar"
      style={{ width: sidebarWidth }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex-auto h-screen w-72 bg-cyan-900 text-xs overflow-auto text-gray-100">
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
      <div
        className="flex-grow-0 flex-shrink-0 basis-1 justify-end cursor-col-resize resize-x hover:bg-slate-200"
        // className="app-sidebar-resizer"
        onMouseDown={startResizing}
      />
    </div>
  );
};

export default SidePanel;

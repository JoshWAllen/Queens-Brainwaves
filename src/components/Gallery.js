import React from "react";
import EvaBlink from "../Data/EvaBlink";
import EvaBite from "../Data/EvaBite";

const Gallery = ({ selectCurrentData, setTitle }) => {
  const galleryFiles = [
    ["Eva Bite", EvaBite],
    ["Eva Blink", EvaBlink],
  ];
  const galleryElements = galleryFiles.map((file) => {
    console.log(file);
    return (
      <div>
        <div
          onClick={() => {
            setTitle(file[0]);
            selectCurrentData(file[1]);
          }}
          className="text-base p-4 hover:cursor-pointer hover:bg-cyan-700"
        >
          {file[0]}
        </div>
      </div>
    );
  });
  return galleryElements;
};

export default Gallery;

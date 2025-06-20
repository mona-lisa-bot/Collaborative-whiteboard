import React from "react";
import jsPDF from "jspdf";
import rectangleIcon from "../resources/icons/rectangle.svg";
import lineIcon from "../resources/icons/line.svg";
import rubberIcon from "../resources/icons/clear_canvas.png";
import pencilIcon from "../resources/icons/pencil.svg";
import textIcon from "../resources/icons/text.svg";
import selectionIcon from "../resources/icons/selection.svg";
import eraserIcon from "../resources/icons/eraser.svg"
import ellipseIcon from "../resources/icons/ellipse.svg";
import undoIcon from "../resources/icons/undo.png";  
import redoIcon from "../resources/icons/redo.png";
import exportIcon from "../resources/icons/export.png";
import pdfIcon from "../resources/icons/pdf.png"; 

import { toolTypes } from "../constants";
import { setColor, updateElement } from "./whiteboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { setElements, setToolType } from "./whiteboardSlice";
import { emitClearWhiteboard } from "../socketConn/socketConn";
import { undo, redo } from "./whiteboardSlice";

const handleExportImage = () => {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  link.download = "whiteboard-export.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

const handleExportPDF = () => {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("whiteboard-export.pdf");
};


const IconButton = ({ src, type, isRubber }) => {
  const dispatch = useDispatch();

  const selectedToolType = useSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => {
    dispatch(setToolType(type));
  };

  const handleClearCanvas = () => {
    dispatch(setElements([]));

    emitClearWhiteboard();
  };

  return (
    <button
      onClick={isRubber ? handleClearCanvas : handleToolChange}
      className={
        selectedToolType === type ? "menu_button_active" : "menu_button"
      }
    >
      <img width="80%" height="80%" src={src} />
    </button>
  );
};

const ColorPicker = () => {
  const dispatch = useDispatch();
  const selectedElementId = useSelector((state) => state.whiteboard.selectedElementId);
  const elements = useSelector((state) => state.whiteboard.elements);

  const selectedColor = useSelector((state) => state.whiteboard.color);

  // const handleChange = (e) => {
  //   dispatch(setColor(e.target.value));
  // };

  const handleChange = (e) => {
  const newColor = e.target.value;
  dispatch(setColor(newColor)); // update global color

  // Update selected element's color if any
  if (selectedElementId) {
    const selectedElement = elements.find((el) => el.id === selectedElementId);
    if (selectedElement) {
      const updatedElement = {
        ...selectedElement,
        color: newColor,
      };
      dispatch(updateElement(updatedElement));
    }
  }
};

  return (
    <input
      type="color"
      value={selectedColor}
      onChange={handleChange}
      style={{
        width: "32px",
        height: "32px",
        border: "none",
        marginLeft: "8px",
        marginTop: "4px",
        cursor: "pointer"
      }}
    />
  );
};


const Menu = () => {

  const dispatch = useDispatch();

  return (
    <div className="menu_container">
      {/* shapes */}
      <div className="toolGroup">
         <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
         <IconButton src={ellipseIcon} type={toolTypes.ELLIPSE} />
         <IconButton src={lineIcon} type={toolTypes.LINE} />
      </div>

      <div className="toolGroup"> 
        <IconButton src={pencilIcon} type={toolTypes.PENCIL} />
        <IconButton src={textIcon} type={toolTypes.TEXT} />
        <ColorPicker />
      </div>
     

      <div className="toolGroup">
          <IconButton src={selectionIcon} type={toolTypes.SELECTION} />
          <IconButton src={eraserIcon} type={toolTypes.ERASER} />
      </div>

      {/* canvas management */}
      <div className="toolGroup">
        <IconButton src={rubberIcon} isRubber />
      <button
      onClick={() => dispatch(undo())}
      className="menu_button"
      title="Undo (Ctrl+Z)"
    >
      <img width="80%" height="80%" src={undoIcon} alt="Undo" />
    </button>

    <button
      onClick={() => dispatch(redo())}
      className="menu_button"
      title="Redo (Ctrl+Y)"
    >
      <img width="80%" height="80%" src={redoIcon} alt="Redo" />
    </button>


      </div>
      

      <div className="toolGroup">
        <button
        onClick={() => handleExportImage()}
        className="menu_button"
        title="Export Canvas"
      >
        <img width="80%" height="80%" src={exportIcon} alt="Export" />
      </button>
        <button
          onClick={handleExportPDF}
          className="menu_button"
          title="Export as PDF"
        >
          <img width="80%" height="80%" src={pdfIcon} alt="Export PDF" />
        </button>
        

      </div>
      
      
    </div>
  );
};

export default Menu;

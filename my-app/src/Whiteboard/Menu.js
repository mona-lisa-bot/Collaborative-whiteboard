import React from "react";
import rectangleIcon from "../resources/icons/rectangle.svg";
import lineIcon from "../resources/icons/line.svg";
import rubberIcon from "../resources/icons/clear_canvas.png";
import pencilIcon from "../resources/icons/pencil.svg";
import textIcon from "../resources/icons/text.svg";
import selectionIcon from "../resources/icons/selection.svg";
import eraserIcon from "../resources/icons/eraser.svg"
import ellipseIcon from "../resources/icons/ellipse.svg";

import { toolTypes } from "../constants";
import { setColor, updateElement } from "./whiteboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { setElements, setToolType } from "./whiteboardSlice";
import { emitClearWhiteboard } from "../socketConn/socketConn";

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
  return (
    <div className="menu_container">
      <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
      <IconButton src={ellipseIcon} type={toolTypes.ELLIPSE} />
      <IconButton src={lineIcon} type={toolTypes.LINE} />
      <IconButton src={rubberIcon} isRubber />
      <IconButton src={pencilIcon} type={toolTypes.PENCIL} />
      <IconButton src={textIcon} type={toolTypes.TEXT} />
      <IconButton src={selectionIcon} type={toolTypes.SELECTION} />
      <IconButton src={eraserIcon} type={toolTypes.ERASER} />
      <ColorPicker />
    </div>
  );
};

export default Menu;

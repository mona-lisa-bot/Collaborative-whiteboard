import { createElement } from ".";
import { toolTypes } from "../../constants";
import { emitElementUpdate } from "../../socketConn/socketConn";
import { store } from "../../store/store";
import { setElements } from "../whiteboardSlice";

export const updatePencilElementWhenMoving = (
  { index, newPoints },
  elements,
  roomId
) => {
  const elementsCopy = [...elements];

  elementsCopy[index] = {
    ...elementsCopy[index],
    points: newPoints,
  };

  console.log("updating pencil element");

  const updatedPencilElement = elementsCopy[index];

  store.dispatch(setElements(elementsCopy));
  emitElementUpdate(updatedPencilElement, roomId);
};

export const updateElement = (
  { id, x1, x2, y1, y2, type, index, text },
  elements,
  roomId,
  setLiveElements
) => {
  const elementsCopy = [...elements];

  switch (type) {
    case toolTypes.LINE:
    case toolTypes.RECTANGLE:
    case toolTypes.ELLIPSE:
      const updatedElement = createElement({
        id,
        x1,
        y1,
        x2,
        y2,
        toolType: type,
        color: elements[index].color || "#000000",
      });

      elementsCopy[index] = updatedElement;
      if (setLiveElements) {
        setLiveElements(elementsCopy); // ✅ fast local update (no Redux)
      } else {
        store.dispatch(setElements(elementsCopy)); // ✅ final update
      }


      emitElementUpdate(updatedElement, roomId);
      break;
    case toolTypes.PENCIL:
      elementsCopy[index] = {
        ...elementsCopy[index],
        points: [
          ...elementsCopy[index].points,
          {
            x: x2,
            y: y2,
          },
        ],
      };

      const updatedPencilElement = elementsCopy[index];

      if (setLiveElements) {
        setLiveElements(elementsCopy); // ✅ fast local update (no Redux)
      } else {
        store.dispatch(setElements(elementsCopy)); // ✅ final update
      }


      emitElementUpdate(updatedPencilElement, roomId);
      break;
    case toolTypes.TEXT:
      const textWidth = document
        .getElementById("canvas")
        .getContext("2d")
        .measureText(text).width;

      const textHeight = 24;

      elementsCopy[index] = {
        ...createElement({
          id,
          x1,
          y1,
          x2: x1 + textWidth,
          y2: y1 + textHeight,
          toolType: type,
          text,
          color: elements[index].color || "#000000",
        }),
      };

      const updatedTextElement = elementsCopy[index];

      if (setLiveElements) {
        setLiveElements(elementsCopy); // ✅ fast local update (no Redux)
      } else {
        store.dispatch(setElements(elementsCopy)); // ✅ final update
      }
      emitElementUpdate(updatedTextElement, roomId);
      break;
    default:
      throw new Error("Something went wrong when updating element");
  }
};

import { toolTypes } from "../../constants";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 ,color}) => {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1,{
    stroke:color || "#000000"
  });
};

const generateEllipse = ({ x1, y1, x2, y2, color}) => {
  return generator.ellipse(
    (x1 + x2) / 2, // center x
    (y1 + y2) / 2, // center y
    Math.abs(x2 - x1), // width
    Math.abs(y2 - y1), // height
    {stroke:color || "#000000"}
  );
};

const generateLine = ({ x1, y1, x2, y2, color}) => {
  return generator.line(x1, y1, x2, y2,{
    stroke:color || "#000000"
  });
};

export const createElement = ({ x1, y1, x2, y2, toolType, id, text,color }) => {
  let roughElement;

  switch (toolType) {
    case toolTypes.RECTANGLE:
      roughElement = generateRectangle({ x1, y1, x2, y2, color});
      return {
        id: id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
        color,
      };
    case toolTypes.ELLIPSE:
      roughElement = generateEllipse({ x1, y1, x2, y2, color});
      return {
        id: id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
        color,
      };
    case toolTypes.LINE:
      roughElement = generateLine({ x1, x2, y1, y2, color });
      return {
        id: id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
        color,
      };
    case toolTypes.PENCIL:
      return {
        id,
        type: toolType,
        points: [{ x: x1, y: y1 }],
        color,
      };
    case toolTypes.TEXT:
      return { id, type: toolType, x1, y1, x2, y2, text: text || "" , color};
    default:
      throw new Error("Something went wrong when creating element");
  }
};

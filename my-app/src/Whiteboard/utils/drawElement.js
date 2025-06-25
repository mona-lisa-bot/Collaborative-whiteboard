import { toolTypes } from "../../constants";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from ".";
import rough from "roughjs/bundled/rough.esm";

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};


const drawPencilElement = (context, element) => {
  if (!element.points || element.points.length < 2) return;
  
  const myStroke = getStroke(element.points, {
    size: 5,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const pathData = getSvgPathFromStroke(myStroke);
  const myPath = new Path2D(pathData);

  context.fillStyle = element.color || "#000000";
  context.fill(myPath);
};

const drawTextElement = (context, element) => {
  context.textBaseline = "top";
  context.font = "24px sans-serif";
  context.fillStyle = element.color || "#000000";
  context.fillText(element.text, element.x1, element.y1);
};
const generator = rough.generator();

const drawShapeElement = (roughCanvas, element) => {
  const options = { stroke: element.color || "#000000",
     seed: hashString(element.id),
   };

  switch (element.type) {
    case toolTypes.RECTANGLE:
      const rect = generator.rectangle(
        element.x1,
        element.y1,
        element.x2 - element.x1,
        element.y2 - element.y1,
        options
      );
      roughCanvas.draw(rect);
      break;

    case toolTypes.ELLIPSE:
      const ellipse = generator.ellipse(
        (element.x1 + element.x2) / 2,
        (element.y1 + element.y2) / 2,
        Math.abs(element.x2 - element.x1),
        Math.abs(element.y2 - element.y1),
        options
      );
      roughCanvas.draw(ellipse);
      break;

    case toolTypes.LINE:
      const line = generator.line(
        element.x1,
        element.y1,
        element.x2,
        element.y2,
        options
      );
      roughCanvas.draw(line);
      break;
  }
};

export const drawElement = ({ roughCanvas, context, element }) => {
  switch (element.type) {
    case toolTypes.RECTANGLE:
    case toolTypes.LINE:
    case toolTypes.ELLIPSE:
      drawShapeElement(roughCanvas, element);
      break;
    case toolTypes.PENCIL:
      drawPencilElement(context, element);
      break;
    case toolTypes.TEXT:
      drawTextElement(context, element);
      break;
    default:
      throw new Error("Something went wrong when drawing element");
  }
};

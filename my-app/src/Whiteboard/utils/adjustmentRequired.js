import { toolTypes } from "../../constants";

export const adjustmentRequired = (type) =>
  [toolTypes.RECTANGLE, toolTypes.ELLIPSE,toolTypes.LINE].includes(type);

import { createSlice } from "@reduxjs/toolkit";
import { createElement } from "./utils/createElement"; // adjust path if needed

const initialState = {
  tool: null,
  elements: [],
  color: "#000000",
  selectedElementId: null,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setToolType: (state, action) => {
      state.tool = action.payload;
    },
    updateElement: (state, action) => {
      const { id } = action.payload;

      const index = state.elements.findIndex((element) => element.id === id);

      if (index === -1) {
        state.elements.push(action.payload);
      } else {
        // if index will be found
        // update element in our array of elements

        state.elements[index] = action.payload;
      }
    },

    

    setElements: (state, action) => {
      state.elements = action.payload;
    },
    setColor: (state, action) => {
    state.color = action.payload;
    },
    setSelectedElementId: (state, action) => {
      state.selectedElementId = action.payload; 
    },
  },
});

export const { setToolType, updateElement, setElements, setColor,  setSelectedElementId } =
  whiteboardSlice.actions;

export default whiteboardSlice.reducer;

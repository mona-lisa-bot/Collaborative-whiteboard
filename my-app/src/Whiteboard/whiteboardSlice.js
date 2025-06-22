import { createSlice } from "@reduxjs/toolkit";
import { createElement } from "./utils/createElement"; // adjust path if needed

const initialState = {
  tool: null,
  elements: [],
  history: [],
  future: [],
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

      // saving the current state t history before making nay changes
      state.history.push([...state.elements]);
      state.future = [];

      if (index === -1) {
        state.elements.push(action.payload);
      } else {
        // if index will be found
        // update element in our array of elements

        state.elements[index] = action.payload;
      }
    },

    addElement: (state, action) => {
      state.history.push([...state.elements]);
      state.elements.push(action.payload);
      state.future = [];
    },

    undo: (state) => {
      if (state.history.length > 0) {
        const previous = state.history.pop();
        // state.future.unshift(state.elements);
        state.future.unshift([...state.elements]);
        state.elements = previous;
         state.elements = Array.isArray(previous) ? previous : [previous];
      }
    },

    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop();
        // state.past.push(state.elements);
        state.history.push([...state.elements]);
        state.elements = Array.isArray(next) ? next : [next];
      }
    },

    clearCanvas: (state) => {
      state.history.push([...state.elements]);
      state.elements = [];
      state.future = [];
    },

    setElements: (state, action) => {
      state.history.push(...state.elements);
      state.elements = Array.isArray(action.payload) ? action.payload : [];
      state.future = [];
    },
    setColor: (state, action) => {
    state.color = action.payload;
    },
    setSelectedElementId: (state, action) => {
      state.selectedElementId = action.payload; 
    },
  },
});

export const { setToolType, updateElement, addElement,
  undo,
  redo,
  clearCanvas,setElements, setColor,  setSelectedElementId } =
  whiteboardSlice.actions;

export default whiteboardSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import whiteboardSliceReducer from "../Whiteboard/whiteboardSlice";
import cursorSliceReducer from "../CursorOverlay/cursorSlice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSliceReducer,
    cursor: cursorSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      //  {
      //   ignoreActions: ["whiteboard/setElements"],
      //   ignoredPaths: ["whiteboard.elements"],
      // },
    }),
});

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Menu from "./Menu";
import rough from "roughjs/bundled/rough.esm";
import { actions, cursorPositions, toolTypes } from "../constants";
import {
  createElement,
  updateElement,
  drawElement,
  adjustmentRequired,
  adjustElementCoordinates,
  getElementAtPosition,
  getCursorForPosition,
  getResizedCoordinates,
  updatePencilElementWhenMoving,
} from "./utils";
import { v4 as uuid } from "uuid";
import { updateElement as updateElementInStore, setElements, setSelectedElementId} from "./whiteboardSlice";
import { emitElementUpdate } from "../socketConn/socketConn";
import { emitCursorPosition } from "../socketConn/socketConn";
import { undo, redo } from "./whiteboardSlice";
import { store } from "../store/store";

import { connectWithSocketServer, getSocketInstance } from "../socketConn/socketConn";

import { useParams } from "react-router-dom";

// const socket=getSocketInstance;

let emitCursor = true;
let lastCursorPosition;


 // default

const Whiteboard = () => {
  const { roomId } = useParams();
  const [socketReady, setSocketReady] = useState(false);

  const [liveElements, setLiveElements] = useState([]);
  const [role, setRole] = useState("viewer");
  const isEditor = role === "editor";
  const elements = useSelector((state) => state.whiteboard.elements);
  // const [copied, setCopied] = useState(false);
  const [copied, setCopied] = useState("");


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleUndo = () => {
  dispatch(undo());
  const updated = store.getState().whiteboard.elements;
  if (Array.isArray(updated)) {
    setLiveElements(updated);
  } else {
    console.error("❌ Undo state is not an array:", updated);
    setLiveElements([]); // fallback to empty array to avoid crash
  }
};

const handleRedo = () => {
  dispatch(redo());
  const updated = store.getState().whiteboard.elements;
   if (Array.isArray(updated)) {
    setLiveElements(updated);
  } else {
    console.error("❌ Redo state is not an array:", updated);
    setLiveElements([]);
  }
};
  useEffect(() => {
    setLiveElements(elements);
  }, [elements]);


  
  useEffect(() => {
  const interval = setInterval(() => {
    const socket = getSocketInstance();
    if (socket && socket.connected) {
      const userId = localStorage.getItem("userId");
      console.log("✅ Socket is connected");

      const roomMeta = JSON.parse(localStorage.getItem("roomMeta"));
      if (roomMeta) {
        socket.emit("create-room", roomMeta);
        console.log("📤 Sent create-room to backend:", roomMeta);
        localStorage.removeItem("roomMeta");
      }


      socket.emit("join-room", {
        roomId,
        userId,
      });

      socket.on("join-success", ({ role, whiteboardState }) => {
        console.log("✅ Assigned role:", role);
        setRole(role); // 💡 Save the user's role in state
        setElements(whiteboardState); // your existing state update
        // Use `role` to enable/disable tools
        // Load whiteboard state
      });

      socket.on("join-error", (message) => {
        alert("❌ Join failed: " + message);
      });

      console.log(`✅ Joined room: ${roomId}`);

      setSocketReady(true);
      clearInterval(interval);
    } else {
      console.log("⏳ Waiting for socket to connect...");
    }
  }, 100);

  return () => clearInterval(interval);
}, [roomId]);




  const canvasRef = useRef();
  const textAreaRef = useRef();

  const toolType = useSelector((state) => state.whiteboard.tool);
  
  const color = useSelector((state) => state.whiteboard.color);

  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [previewElement, setPreviewElement] = useState(null);


  


  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height)


      liveElements.forEach((element) => {
        drawElement({ roughCanvas, context: ctx, element });
      });

      if (previewElement) {
        drawElement({ roughCanvas, context: ctx, element: previewElement });
     }
    }, [liveElements, previewElement]);

    console.log("undo state",  store.getState().whiteboard.elements)

  



  const handleMouseDown = (event) => {
    if(!isEditor) return;
    const { clientX, clientY } = event;

    if (selectedElement && action === actions.WRITING) {
      return;
    }

    switch (toolType) {
      case toolTypes.RECTANGLE:
      case toolTypes.ELLIPSE:
      case toolTypes.LINE:
      case toolTypes.PENCIL: {
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
          color,
        });

        setAction(actions.DRAWING);
        setSelectedElement(element);
        setLiveElements((prev) => [...prev, element]);
        emitElementUpdate(element, roomId);
        break;
      }
      case toolTypes.ERASER: {
  // Step 2a: Find the element under the mouse click
      const element = getElementAtPosition(clientX, clientY, liveElements);

  // Step 2b: If there's an element, remove it from the elements list
      if (element) {
       const updatedElements = elements.filter((el) => el.id !== element.id);
       setLiveElements(updatedElements);
       dispatch(setElements(updatedElements));
      }

  // Step 2c: Return so it doesn't go to drawing logic
     return;
    }

      case toolTypes.TEXT: {
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
          color,
        });

        setAction(actions.WRITING);
        setSelectedElement(element);
        setLiveElements((prev) => [...prev, element]);
        break;
      }
      case toolTypes.SELECTION: {
        const element = getElementAtPosition(clientX, clientY, liveElements);

        if (element) {
          dispatch(setSelectedElementId(element.id)); 
  }

        if (
          element &&
          (element.type === toolTypes.RECTANGLE ||
            element.type === toolTypes.TEXT ||
            element.type === toolTypes.LINE||
            element.type === toolTypes.ELLIPSE
          )
        ) {
          setAction(
            element.position === cursorPositions.INSIDE
              ? actions.MOVING
              : actions.RESIZING
          );

          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;

          setSelectedElement({ ...element, offsetX, offsetY });
          // dispatch(setSelectedElementId(element.id));

        }

        if (element && element.type === toolTypes.PENCIL) {
          setAction(actions.MOVING);

          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);

          setSelectedElement({ ...element, xOffsets, yOffsets });
          dispatch(setSelectedElementId(element.id));

        }
        break;
      }
    }
  };

  const handleMouseUp = () => {
  if (!isEditor) return;

  if (action === actions.DRAWING && previewElement) {
    const finalizedElement = adjustmentRequired(previewElement.type)
      ? {
          ...previewElement,
          ...adjustElementCoordinates(previewElement),
        }
      : previewElement;

    // Save finalized element to liveElements
    const updated = [...liveElements, finalizedElement];
    setLiveElements(updated);
    dispatch(setElements(updated));
    emitElementUpdate(finalizedElement, roomId);
  }

  setAction(null);
  setSelectedElement(null);
  setPreviewElement(null); // ✅ Clear preview after committing
};


  const handleMouseMove = (event) => {
    if (!isEditor) return;
    const { clientX, clientY } = event;

    lastCursorPosition = { x: clientX, y: clientY };

    if (emitCursor) {
      emitCursorPosition({ x: clientX, y: clientY }, roomId);
      emitCursor = false;

      console.log("sending-position");

      setTimeout(() => {
        emitCursor = true;
        emitCursorPosition(lastCursorPosition, roomId);
      }, 50);
    }

    if (action === actions.DRAWING && selectedElement?.type === toolTypes.PENCIL) {
          const index = liveElements.findIndex((el) => el.id === selectedElement.id);
          if (index !== -1) {
            const updated = [...liveElements];
            const updatedElement = {
              ...updated[index],
              points: [...updated[index].points, { x: clientX, y: clientY }],
            };
            updated[index] = updatedElement;
            setLiveElements(updated);
            emitElementUpdate(updatedElement, roomId);
          }
          return;
           }

    if (
      action === actions.DRAWING &&
      selectedElement?.type !== toolTypes.PENCIL
    ) {
      setPreviewElement({
        ...selectedElement,
        x2: clientX,
        y2: clientY,
      });
      return;
    }

      


    if (toolType === toolTypes.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, liveElements);

      event.target.style.cursor = element
        ? getCursorForPosition(element.position)
        : "default";
    }

    if (
      selectedElement &&
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement.type === toolTypes.PENCIL
    ) {
      const newPoints = selectedElement.points.map((_, index) => ({
        x: clientX - selectedElement.xOffsets[index],
        y: clientY - selectedElement.yOffsets[index],
      }));

      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if (index !== -1) {
        updatePencilElementWhenMoving({ index, newPoints }, elements, roomId);
      }

      return;
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement
    ) {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY, text } =
        selectedElement;

      const width = x2 - x1;
      const height = y2 - y1;

      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;

      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if (index !== -1) {
        updateElement(
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            index,
            text,
          },
          liveElements,
          roomId,
          setLiveElements
        );
      }
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.RESIZING &&
      selectedElement
    ) {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = getResizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );

      const selectedElementIndex = elements.findIndex(
        (el) => el.id === selectedElement.id
      );

      if (selectedElementIndex !== -1) {
        updateElement(
          {
            x1,
            x2,
            y1,
            y2,
            type: selectedElement.type,
            id: selectedElement.id,
            index: selectedElementIndex,
          },
          liveElements,
          roomId,
          setLiveElements
        );
      }
    }
  };

  const handleTextareaBlur = (event) => {
    if (!isEditor) return;
    const { id, x1, y1, type } = selectedElement;

    const index = liveElements.findIndex((el) => el.id === selectedElement.id);

    if (index !== -1) {
      updateElement(
        { id, x1, y1, type, text: event.target.value, index },
        liveElements,
        roomId,
        setLiveElements
      );

      setAction(null);
      setSelectedElement(null);
    }
  };

  
  return (
    <>
      {console.log("✅ Menu component is being rendered")}
      {isEditor&& (
      <Menu 
          handleUndo={handleUndo}
          handleRedo={handleRedo}
      
      />
  )}
      {action === actions.WRITING ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextareaBlur}
          style={{
            position: "absolute",
            top: selectedElement.y1 - 3,
            left: selectedElement.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : null}

      <div className="room-id-banner">

  {/* Copy Room ID button */}
  <button
    className="copy-button"
    onClick={() => {
      navigator.clipboard.writeText(roomId);
      setCopied("id");
      setTimeout(() => setCopied(""), 2000);
    }}
    title="Copy Room ID"
  >
    📋
  </button>

  {/* Copy Invite Link button */}
  <button
    className="copy-button"
    onClick={() => {
      navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
      setCopied("link");
      setTimeout(() => setCopied(""), 2000);
    }}
    title="Copy Invite Link"
  >
    🔗
  </button>

  {/* Feedback */}
  {copied === "id" && <span className="copied-text">Room ID Copied!</span>}
  {copied === "link" && <span className="copied-text">Invite Link Copied!</span>}
</div>


      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        id="canvas"
      />
    </>
  );
};

export default Whiteboard;
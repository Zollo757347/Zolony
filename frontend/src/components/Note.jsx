import { useRef } from "react";
import "../styles/note.css";

const Note = ({ type, children }) => {
  const { current: className } = useRef(
    type === 'danger' ? "z-note-danger" :
    type === 'success' ? "z-note-success" :
    "z-note-normal"
  );

  return (
    <div className={className}>{children}</div>
  );
}

export default Note;
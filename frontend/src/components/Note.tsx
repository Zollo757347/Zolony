import { useRef } from "react";
import "../styles/note.css";

interface NoteProps {
  type: 'normal' | 'success' | 'danger';
  children: React.ReactNode;
  [key: string]: any;
}

const Note = ({ type, children, ...props }: NoteProps) => {
  const { current: className } = useRef(
    type === 'danger' ? "z-note-danger" :
    type === 'success' ? "z-note-success" :
    "z-note-normal"
  );

  return (
    <div className={className} {...props}>{children}</div>
  );
}

export default Note;
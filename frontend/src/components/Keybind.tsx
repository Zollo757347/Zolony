import "../styles/keybind.css";

interface KeybindProps {
  type: keyof typeof contentTable;
  content?: string;
  keybind?: string;
}

/**
 * @param {KeybindParams} params 
 */
const Keybind = ({ type, content, keybind }: KeybindProps) => {
  return (
    <span className="z-keybind">
      <span className="z-keybind-span">{content ?? contentTable[type]}</span>
      <span className="z-keybind-tooltip">預設為{keybind ?? keybindTable[type]}</span>
    </span>
  );
}
export default Keybind;

const contentTable = Object.freeze({
  break: '破壞', 
  interact: '互動', 
  place: '放置', 
  showDebugScreen: '開啟除錯介面', 
  showEntities: '顯示實體'
});

const keybindTable = Object.freeze({
  break: '滑鼠左鍵', 
  interact: '滑鼠右鍵', 
  place: '滑鼠右鍵', 
  showDebugScreen: ' F3', 
  showEntities: ' F3 + G'
});
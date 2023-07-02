import { useState } from "react";
import { Link } from "react-router-dom";

import "../../styles/sidebar_content.css";

const SidebarContent = ({ content }) => {
  const [openedIndex, setOpenedIndex] = useState(-1);

  function handleClickParent(index) {
    if (openedIndex === index) {
      setOpenedIndex(-1);
    }
    else {
      setOpenedIndex(index);
    }
  }

  const blocks = [];
  content.forEach((item, i) => {
    if (item.childs.length) {
      blocks.push(<div key={blocks.length} className="z-sidebar-content-parent" onClick={() => handleClickParent(i)}>{item.name}</div>);
      
      if (i === openedIndex) {
        item.childs.forEach(c => {
          blocks.push(<Link key={blocks.length} to={c.path}><div className="z-sidebar-content-child">{c.name}</div></Link>);
        });
      }
    }
  });

  return (
    <div className='z-sidebar-content-wrapper'>
      {blocks}
    </div>
  )
}

export default SidebarContent;
import { useEffect, useRef } from "react";
import Info from "./Info";
import { useHook } from "../hooks/useHook";
import './css/Page.css';

import MainPage from "../components/data/article/MainPage";
import Signal from "../components/data/article/Signal";
import Transmit from "../components/data/article/Transmit";
import Repeater from "../components/data/article/Repeater";
import Torch from "../components/data/article/Torch";
import Notorand from "../components/data/article/Notorand";
import Adder from "../components/data/article/Adder";

const Page = ({ setOpenModal }) => {
  const divRef = useRef();
  const { loggedIn, pageNum } = useHook();

  const pages = [<MainPage/>, <Signal/>, <Transmit/>, <Repeater/>, <Torch/>, <Notorand/>, <Adder/>];

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pageNum]);

  return <div style={{ padding: 15, width: 900, backgroundColor: '#FBFAB7' }}>
    <div ref={divRef} style={{ transform: 'translateY(-100px)' }}></div>
    {pageNum === 0 && loggedIn ? <Info setOpenModal={setOpenModal}/> : (pages[pageNum - 1])}
  </div>;
}

export default Page;
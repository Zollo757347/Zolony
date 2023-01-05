import { useEffect, useRef } from "react";
import Info from "./Info"
import { UseHook } from "../hook/usehook"
import './css/Page.css'

import MainPage from "./data/article/MainPage"
import Signal from "./data/article/Signal"
import Transmit from "./data/article/Transmit"
import Repeater from "./data/article/Repeater"
import Torch from "./data/article/Torch";
import Notorand from "./data/article/Notorand";
import Adder from "./data/article/Adder";

const Page = ({ pageNum, setOpenModal }) => {
  // const h1Ref = useRef(<h1></h1>);
  const { isLogIn } = UseHook();

  const pages = [<MainPage/>, <Signal/>, <Transmit/>, <Repeater/>, <Torch/>, <Notorand/>, <Adder/>];

  useEffect(() => {
    // h1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pageNum]);
  return <div style={{ paddingBottom: 100 }}>
    {pageNum === 0 && isLogIn ? <Info setOpenModal={setOpenModal}/> : pages[pageNum - 1]}
  </div>;
}

export default Page;
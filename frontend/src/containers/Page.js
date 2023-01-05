import { useEffect, useRef } from "react";
import Info from "./Info"
import { UseHook } from "../hook/usehook"
import './css/Page.css'

import MainPage from "../components/data/article/MainPage"
import Signal from "../components/data/article/Signal"
import Transmit from "../components/data/article/Transmit"
import Repeater from "../components/data/article/Repeater"
import Torch from "../components/data/article/Torch";
import Notorand from "../components/data/article/Notorand";
import Adder from "../components/data/article/Adder";

const Page = ({ setOpenModal }) => {
  // const h1Ref = useRef(<h1></h1>);
  const { isLogIn, pageNum } = UseHook();

  const pages = [<MainPage/>, <Signal/>, <Transmit/>, <Repeater/>, <Torch/>, <Notorand/>, <Adder/>];

  useEffect(() => {
    // h1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pageNum]);
  return <div style={{ paddingBottom: 100, width: "100%" }}>
    {pageNum === 0 && isLogIn ? <Info setOpenModal={setOpenModal}/> : (pages[pageNum - 1])}
  </div>;
}

export default Page;
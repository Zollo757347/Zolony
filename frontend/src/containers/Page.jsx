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
  const { loggedIn, pageNum } = useHook();

  const pages = [<MainPage/>, <Signal/>, <Transmit/>, <Repeater/>, <Torch/>, <Notorand/>, <Adder/>];

  return <div style={{ paddingBottom: 100, width: "100%" }}>
    {pageNum === 0 && loggedIn ? <Info setOpenModal={setOpenModal}/> : (pages[pageNum - 1])}
  </div>;
}

export default Page;
import { Route, Routes as ReactRoutes } from 'react-router-dom';

import MainPage from "../pages";

import Notorand from "../pages/concepts/Notorand";

import General from '../pages/general';
import Nouns from '../pages/general/Nouns';

import Adder from "../pages/redstone/Adder";
import Repeater from "../pages/redstone/Repeater";
import Signal from "../pages/redstone/Signal";
import Torch from "../pages/redstone/Torch";
import Transmit from "../pages/redstone/Transmit";

import Profile from "../pages/Profile";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path='/' element={<MainPage />} />

      <Route path='/general'>
        <Route index element={<General />} />
        <Route path="nouns" element={<Nouns />} />
      </Route>

      <Route path='/redstone'>
        <Route path='adder' element={<Adder />} />
        <Route path='repeater' element={<Repeater />} />
        <Route path='signal' element={<Signal />} />
        <Route path='torch' element={<Torch />} />
        <Route path='transmit' element={<Transmit />} />
      </Route>

      <Route path='/concepts'>
        <Route path='notorand' element={<Notorand />} />
      </Route>
      
      <Route path='/profile' element={<Profile />} />
    </ReactRoutes>
  );
}

export default Routes;
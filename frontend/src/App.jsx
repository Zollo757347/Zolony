
import Canvas from './containers/Canvas';
import './App.css';

const App = () => {
  let d = 3;
  return (
    <div className="app">
      <Canvas canvasWidth={500} canvasHeight={500} xLen={d} yLen={d} zLen={d} />
    </div>
  )
}

export default App;
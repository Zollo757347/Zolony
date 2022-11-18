
import Canvas from './containers/Canvas';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Canvas canvasWidth={500} canvasHeight={500} xLen={7} yLen={7} zLen={7} />
    </div>
  )
}

export default App;
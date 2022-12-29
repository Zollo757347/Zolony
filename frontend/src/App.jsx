import Canvas from './containers/Canvas';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Canvas canvasWidth={1000} canvasHeight={1000} xLen={4} yLen={7} zLen={13} />
    </div>
  )
}

export default App;
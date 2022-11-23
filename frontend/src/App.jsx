
import Canvas from './containers/Canvas';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Canvas canvasWidth={500} canvasHeight={500} xLen={8} yLen={8} zLen={8} />
    </div>
  )
}

export default App;
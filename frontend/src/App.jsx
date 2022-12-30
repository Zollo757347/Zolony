import Canvas from './components/Canvas';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Canvas canvasWidth={500} canvasHeight={500} xLen={5} yLen={5} zLen={5} />
    </div>
  )
}

export default App;
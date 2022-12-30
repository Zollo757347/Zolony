import Canvas from './components/Canvas';
import './App.css';

const App = () => {
  const w = 500;
  const d = 5;

  return (
    <div className="app">
      <Canvas canvasWidth={w} canvasHeight={w} xLen={d} yLen={d} zLen={d} />
    </div>
  );
}

export default App;
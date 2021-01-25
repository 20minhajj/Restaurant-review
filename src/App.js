import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Maps from './components/maps'
function App() {
  return (
    <div className="container-fluid">
      <nav className="navbar navbar-light bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-light text-pad" href="/">
            Restaurant Review
          </a>
        </div>
      </nav>
      <Maps />
    </div>
  );
}

export default App;

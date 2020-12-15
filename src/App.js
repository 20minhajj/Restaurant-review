import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

function App() {
  return (
    <div className="container-fluid">
      <nav className="navbar navbar-light bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-light text-pad" href="/">Restaurant Review</a>
          <form class="d-flex btn-pad">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Restaurant"
              aria-label="Search"
            />
            <button className="btn btn-outline-success " type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}

export default App;

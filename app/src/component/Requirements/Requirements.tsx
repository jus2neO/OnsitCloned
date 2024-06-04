import "./App.css";
import Carousel from "./components/Carousel";
import { countries } from "./components/Data";

function App() {
  return (
    <><div className="App">
      <div className="topContent">
        <h1>SIT REQUIREMENTS</h1>

      </div>
      {/* Carousel */}
      <Carousel images={countries} />
    </div><div className="bottomContent">
      <h4>Please prepare the following requirements prior to</h4>
      <h4>enrollment. Refer to the list of requirements as posted here.</h4>

      </div></>
  );
}

export default App;
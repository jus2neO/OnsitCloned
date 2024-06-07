import "./dashboard.scss";
import ImgHero from "./images/home.jpg";


function App() {
  return (
    
    <section className="hero">
     
      <div className="content">
        <h1>TUPV SIT OFFICE ADMIN PORTAL.</h1>
        <p>
          {" "}
          A faster way of Enrollment, Data Retrieval
           and Appointments, all in one website.
        </p>
        <a href="/appointments">View Appointments</a>
        <a href="/staffaccounts">View Staff</a>
      </div>
    </section>
  );
}

export default App;
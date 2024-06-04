import "./Hompage.css";
import ImgHero from "./images/home.jpg";


function App() {
  return (
    
    <section className="hero" style={{ backgroundImage: `url(${ImgHero})` }}>
     
      <div className="content">
        <h1>TUPV SIT OFFICE ONLINE PORTAL.</h1>
        <p>
          {" "}
          A faster way of Enrollment, Data Retrieval
           and Appointments, all in one website.
        </p>
        <a href="/bookappointment">Book Now</a>
      </div>
    </section>
  );
}

export default App;
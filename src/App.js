import "./App.css";
import WeatherCard from "./components/WeatherCard/WeatherCard";

function App() {
  return (
    <div className="App">
      <h1>Weady</h1>
      <p>
        To see weather details in your area enable location or search using the
        form below.
      </p>
      <WeatherCard></WeatherCard>
    </div>
  );
}

export default App;

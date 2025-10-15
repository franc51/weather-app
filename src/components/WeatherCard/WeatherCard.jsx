import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import "./WeatherCard.css";
import {
  getWeatherByCoords,
  getWeatherByLocation,
} from "../../services/WeatherService/WeatherService.js";

const WeatherCard = () => {
  const [location, setLocation] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardColor, setCardColor] = useState("");

  // fetch weather for the user's live location
  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherByCoords(latitude, longitude);
            setWeatherInfo({ name: "Your Location", ...data });
          } catch (err) {
            setError("Failed to get weather for your location");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setError("Location access denied. Please search manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
    }
  }, []);

  // manual search
  const handleSearch = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByLocation(location);
      setWeatherInfo(data);
    } catch (err) {
      setError(err.message);
      setWeatherInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // color changer based on weather
  useEffect(() => {
    if (!weatherInfo) return;
    if (weatherInfo.temperature >= 30) {
      setCardColor("#ffe89c"); // hot
    } else if (weatherInfo.temperature >= 20) {
      setCardColor("#87ceeb"); // warm
    } else if (weatherInfo.temperature >= 10) {
      setCardColor("#f0e68c"); // cool
    } else {
      setCardColor("#b8f1fc"); // cold
    }
  }, [weatherInfo]);

  return (
    <div>
      {" "}
      <Box className="search_box">
        <TextField
          label="Enter location"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          size="medium"
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Box
        className="weather_card_container"
        style={{ backgroundColor: cardColor || "#f9f9f9" }}
      >
        {loading && (
          <Box className="loading_box">
            <CircularProgress />
            <p>Loading weather...</p>
          </Box>
        )}

        {error && <p className="error_text">{error}</p>}

        {weatherInfo && !loading && (
          <Box className="weather_info">
            <h2>{weatherInfo.name}</h2>
            <img src="https://cdn-icons-png.flaticon.com/512/10480/10480648.png"></img>
            <h3>Temperature: {weatherInfo.temperature}°C</h3>
            <h3>Wind: {weatherInfo.wind} km/h</h3>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default WeatherCard;

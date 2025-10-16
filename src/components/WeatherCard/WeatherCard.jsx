import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import "./WeatherCard.css";

// importing service
import {
  getWeatherByCoords,
  getWeatherByLocation,
} from "../../services/WeatherService/WeatherService.js";

// importing icons from assets folder
import sunIcon from "../../assets/sun.png";
import rainIcon from "../../assets/rain.png";
import windIcon from "../../assets/wind.png";
import cloudsIcon from "../../assets/clouds.png";
import snowflakeIcon from "../../assets/snowflake.png";

const WeatherCard = () => {
  const [location, setLocation] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardColor, setCardColor] = useState("");

  // map weather codes to icons, from open-meteo docs
  const weatherIcons = {
    0: sunIcon,
    1: sunIcon,
    2: cloudsIcon,
    3: cloudsIcon,
    61: rainIcon,
    63: rainIcon,
    65: rainIcon,
    71: snowflakeIcon,
    73: snowflakeIcon,
    75: snowflakeIcon,
  };

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

  // fetch weather when user manual search
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

  const getWeatherIcon = () => {
    if (!weatherInfo) return null;
    return weatherIcons[weatherInfo.code || sunIcon];
  };

  // function to get the current date
  function getDate() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("ro-RO", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const capitalizedDate = formattedDate
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return capitalizedDate;
  }

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button variant="contained" size="large" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Box
        className="weather_card_container"
        style={{ backgroundColor: cardColor || "white" }}
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
            <div className="weather_degrees">
              <h3>{weatherInfo.temperature}°</h3>
            </div>
            <div className="weather_location">
              <h3>{weatherInfo.name}</h3>
              <p>{getDate()}</p>
            </div>
            <img src={getWeatherIcon()} alt="Weather icon"></img>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default WeatherCard;

// get weather by geographic coordinates - helper function
export async function getWeatherByCoords(latitude, longitude) {
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`
  );
  const weatherData = await weatherRes.json();

  const current = weatherData.current;
  return {
    latitude,
    longitude,
    temperature: current.temperature_2m,
    wind: current.wind_speed_10m,
    code: current.weather_code,
  };
}

// get weather by location name
export async function getWeatherByLocation(location) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      location
    )}`
  );
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Location not found");
  }

  const { latitude, longitude, name, country } = geoData.results[0];
  const weather = await getWeatherByCoords(latitude, longitude);

  return { name, country, ...weather };
}

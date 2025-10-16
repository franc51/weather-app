// get weather by geographic coordinates - helper function
export async function getWeatherByCoords(latitude, longitude) {
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation,cloudcover`
  );
  const weatherData = await weatherRes.json();
  const currentWeather = weatherData.current_weather;
  // get the index of the current hour in the hourly arrays
  const currentHourIndex = weatherData.hourly.time.indexOf(currentWeather.time);
  return {
    latitude,
    longitude,
    temperature: currentWeather.temperature,
    wind: currentWeather.windspeed,
    code: currentWeather.weathercode,
    rain: weatherData.hourly.precipitation[currentHourIndex],
    cloud: weatherData.hourly.cloudcover[currentHourIndex],
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

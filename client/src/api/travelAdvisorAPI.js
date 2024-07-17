import axios from "axios";

// Fetch places data from RapidAPI Travel Advisor API
export const getPlacesData = async (type, sw, ne) => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
          tr_latitude: ne.lat,
        },
        headers: {
          "x-rapidapi-key": import.meta.env
            .VITE_REACT_APP_RAPID_API_TRAVEL_API_KEY,
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("getPlacesData error: ", error);
  }
};

// Fetch weather data from RapidAPI Open Weather Map API
export const getWeatherData = async (lat, lng) => {
  try {
    if (lat && lng) {
      const response = await axios.get(
        "https://weather-api99.p.rapidapi.com/weather",
        {
          params: { lat, lon: lng },
          headers: {
            "x-rapidapi-key": import.meta.env
              .VITE_REACT_APP_RAPID_API_WEATHER_API_KEY,
            "x-rapidapi-host": "weather-api99.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error("getWeatherData error: ", error);
  }
};

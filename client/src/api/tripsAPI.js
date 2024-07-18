import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

//get all trips
export const getTrips = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios(`${BASE_URL}/trips/${userId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

//create single trip
export const createTrip = async (body) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const trip = await axios.post(`${BASE_URL}/trips`, body, { headers });
    return trip.data;
  } catch (error) {
    console.error(error.message);
  }
};

//get trip
export const getSingleTrip = async (tripId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(`${BASE_URL}/trips/trip/${tripId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

//update trip
export const updateTrip = async (tripId, body) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(`${BASE_URL}/trips/${tripId}`, body, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

//delete trip
export const deleteTrip = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    await axios.delete(`${BASE_URL}/trips/${id}`, { headers });
    return;
  } catch (error) {
    console.error(error.message);
  }
};

//get trip places to visit
export const getPlacesToVisit = async (tripId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios(`${BASE_URL}/trips/${tripId}/places`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

//get trip expenses
export const getTripExpenses = async (tripId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios(`${BASE_URL}/trips/${tripId}/expenses`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

//get trip places by day
export const getPlacesByDate = async (date, tripId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const place = await axios.get(
      `${BASE_URL}/trips/${tripId}/places/${date}`,
      { headers }
    );
    return place.data;
  } catch (error) {
    console.error(error.message);
  }
};

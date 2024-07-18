import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

//create/add new place
export const createPlace = async (body) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const place = await axios.post(`${BASE_URL}/places`, body, { headers });
    return place.data;
  } catch (error) {
    console.error(error.message);
  }
};

//update place
export const updatePlace = async (placeId, body) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const place = await axios.put(`${BASE_URL}/places/${placeId}`, body, {
      headers,
    });
    return place.data;
  } catch (error) {
    console.error(error.message);
  }
};

//delete place
export const deletePlace = async (placeId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const place = await axios.delete(`${BASE_URL}/places/${placeId}`, {
      headers,
    });
    return place.data;
  } catch (error) {
    console.error(error.message);
  }
};

//get favorites users places
export const getFavPlaces = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const place = await axios.get(`${BASE_URL}/places/favorites/${userId}`, {
      headers,
    });
    return place.data;
  } catch (error) {
    console.error(error.message);
  }
};

import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

//get user
export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const user = await axios.get(`${BASE_URL}/api/users`, { headers });
    return user.data;
  } catch (error) {
    console.error(error.message);
  }
};

//update user
export const updateUser = async (userId, body) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const user = await axios.put(`${BASE_URL}/api/users/${userId}`, body, {
      headers,
    });
    return user.data;
  } catch (error) {
    console.error(error.message);
  }
};

//delete user
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const user = await axios.delete(`${BASE_URL}/api/users/${userId}`, {
      headers,
    });
    return user.data;
  } catch (error) {
    console.error(error.message);
  }
};

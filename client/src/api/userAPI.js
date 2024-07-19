import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Correct URL for getting user details
export const getUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error;
  }
};

export const getAllUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

// Update user
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
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.delete(`${BASE_URL}/api/users/${userId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

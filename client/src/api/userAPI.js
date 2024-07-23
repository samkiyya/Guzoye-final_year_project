import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Fetch user data (from token validation)
export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const response = await fetch(`${BASE_URL}/api/auth/validate-token`, {
      method: "GET",
      credentials: "include", // Include cookies in the request
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.text(); // Get response text for debugging
      throw new Error(`Failed to fetch user data: ${errorData}`);
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

// Get user by ID
export const getUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text(); // Get response text for debugging
      throw new Error(`Error fetching user: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    throw error;
  }
};

// Get all users
export const getAllUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

// Update user details
export const updateUser = async (userId, body) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.put(`${BASE_URL}/api/users/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error updating user: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.delete(`${BASE_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error deleting user: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
};

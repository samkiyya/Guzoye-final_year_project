import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../api/userAPI";
import PropTypes from "prop-types";
import { decodeToken } from "../utils/tokenUtils";

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    const getUserData = async () => {
      if (token) {
        try {
          const decodedToken = decodeToken(token); // Extract user info from token
          const userId = decodedToken.id; // Adjust this line based on your token structure

          if (userId) {
            const user = await getUser(userId); // Pass userId to getUser
            if (user) {
              setAuthUser({
                _id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                token: token,
              });
            } else {
              setAuthUser(null);
            }
          } else {
            setAuthUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthUser(null);
        }
      } else {
        setAuthUser(null);
      }
      setIsLoading(false);
    };

    getUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

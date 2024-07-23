export const decodeToken = (token) => {
  if (!token) return {};
  try {
    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return {};
  }
};

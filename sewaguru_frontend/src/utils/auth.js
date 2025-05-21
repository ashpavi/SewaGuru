import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("accessToken");

export const getUser = () => {
  const token = isTokenExpired() ? null : getToken();
  return token ? jwtDecode(token) : null;
};

export const isAdmin = () => {
  const user = getUser();
  const result = user && user.role === "admin";
  console.log("isAdmin executed:", result);
  return result;
};

export const isProvider = () => {
  const user = getUser();
  const result = user && user.role === "provider";
  console.log("isProvider executed:", result);
  return result;
};

export const isTokenExpired = () => {
  var isExpired;
  const token = getToken();
  if (!token) isExpired = true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    isExpired = decoded.exp < currentTime;
  } catch {
    isExpired = true;
  }

  if (isExpired) {
    localStorage.removeItem('accessToken');
  }

  return isExpired;
};
import { jwtDecode } from "jwt-decode";

export const token = localStorage.getItem("accessToken");
export const user = token ? jwtDecode(token) : null;
export const isAdmin = user && user.role === "admin";
export const isProvider = user && user.role === "provider";

export const isTokenExpired = () => {
  var isExpired;
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
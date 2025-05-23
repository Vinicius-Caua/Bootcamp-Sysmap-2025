import axios from "axios";

// Base URL backend
const BASE_URL = "http://localhost:3000";

// Public routes instance
export const publicApi = axios.create({
  baseURL: BASE_URL,
});

// Private routes instance (with JWT)
export const privateApi = axios.create({
  baseURL: BASE_URL,
});

// Middleware to add JWT token to requests
privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to headers
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request error
);

// Interceptor to handle responses and errors
privateApi.interceptors.response.use(
  (response) => response, // Handle successful response
  (error) => {
    // Handle error response
    return Promise.reject(error);
  }
);

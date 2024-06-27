import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.8.197:8081",
});

export const logIn = (formData) =>
  API.post("api/v1/auth/authenticate", formData);

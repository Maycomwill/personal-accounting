import axios from "axios";

const server = axios.create({
  baseURL: process.env.SERVER_PRODUCTION_URL || "http://localhost:4000",
});

export default server;

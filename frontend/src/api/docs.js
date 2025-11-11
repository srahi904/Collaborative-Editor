/** @format */

import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const fetchDocument = (id, token) =>
  axios.get(`${API_URL}/docs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const saveDocument = (id, content, token) =>
  axios.put(
    `${API_URL}/docs/${id}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );

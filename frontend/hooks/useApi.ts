"use client";

import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL + "/api";
const staticURL = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = () => {
  const token = Cookies.get("jwt-token");
  return {
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export function useApi() {
  const get = async (endpoint: string) => {
    const response = await axios.get(baseURL + endpoint, {
      headers: getAuthHeaders(),
    });

    return response;
  };

  const post = async (endpoint: string, postData: object | FormData) => {
    const response = await axios.post(baseURL + endpoint, postData, {
      headers: getAuthHeaders(),
    });

    return response;
  };

  const put = async (endpoint: string, postData: object) => {
    const response = await axios.put(baseURL + endpoint, postData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    return response;
  };

  const patch = async (endpoint: string, postData: object) => {
    const response = await axios.patch(baseURL + endpoint, postData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    return response;
  };

  const del = async (endpoint: string) => {
    const response = await axios.delete(baseURL + endpoint, {
      headers: getAuthHeaders(),
    });

    return response;
  };

  return {
    get,
    post,
    put,
    patch,
    del,
    baseURL,
    staticURL,
  };
}

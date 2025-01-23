import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_SERVER_ENDPOINT+`/api/v1`;

export const loginApi = async (body:{identifier: string, password: string}) => {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }

  return data;
};

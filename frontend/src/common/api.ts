import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_SERVER_ENDPOINT + `/api/v1`;

export const loginApi = async (body: {
  identifier: string;
  password: string;
}) => {
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

// ******************** Products *********************** //

export const productListApi = async (page?: number, limit?: number) => {
  const response = await fetch(
    `${apiUrl}/product/list?page=${page ?? 1}&limit=${limit ?? 10}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${Cookies.get("tokenId")}`,
        "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }

  return data;
};

export const editProductApi = async (body: any, id: number) => {
  const response = await fetch(`${apiUrl}/product/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("tokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }

  return data;
};

export const createProductApi = async (body: any) => {
  const response = await fetch(`${apiUrl}/product`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("tokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }

  return data;
};

export const deleteProductApi = async (id: number) => {
  const response = await fetch(`${apiUrl}/product/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("tokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }

  return data;
};

// ******************** Promotion *********************** //

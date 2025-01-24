import Cookies from "js-cookie";
import {ICreateProductDto, ICreatePromotionDto, IOrderItem, IUpdateProductDto, IUpdatePromotionDto } from "./interface";

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
    throw new Error(data.message || "Failed");
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
    throw new Error(data.message || "Failed");
  }

  return data;
};

export const editProductApi = async (body: IUpdateProductDto, id: number) => {
  const response = await fetch(`${apiUrl}/product/${id}`, {
    method: "PUT",
    body:JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("tokenId")}`,
      "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  return data;
};

export const createProductApi = async (body: ICreateProductDto) => {
  const response = await fetch(`${apiUrl}/product`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("tokenId")}`,
      "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  return data;
};

export const deleteProductApi = async (id: number) => {
  const response = await fetch(`${apiUrl}/product/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("tokenId")}`,
      "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  return data;
};

// ******************** Promotion *********************** //

export const promotionListApi = async (page?: number, limit?: number) => {
  const response = await fetch(
    `${apiUrl}/promotion/list?page=${page ?? 1}&limit=${limit ?? 10}`,
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
    throw new Error(data.message || "Failed");
  }

  return data;
};

export const availablePromotionListApi = async () => {
  const response = await fetch(
    `${apiUrl}/promotion/list/available`,
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
    throw new Error(data.message || "Failed");
  }

  return data;
};

export const editPromotionApi = async (body: IUpdatePromotionDto, id: number) => {
  const response = await fetch(`${apiUrl}/promotion/${id}`, {
    method: "PUT",
    body:JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("tokenId")}`,
      "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  return data;
};

export const createPromotionApi = async (body: ICreatePromotionDto) => {
  const response = await fetch(`${apiUrl}/promotion`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("tokenId")}`,
      "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  return data;
};

export const deletePromotionApi = async (id: number) => {
  const response = await fetch(`${apiUrl}/promotion/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("tokenId")}`,
      "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  return data;
};


// ******************** Order *********************** //

export const createOrderApi = async (body: IOrderItem[]) => {
  const response = await fetch(`${apiUrl}/order`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("tokenId")}`,
      "x-refresh-token": `${Cookies.get("refreshTokenId")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  return data;
};
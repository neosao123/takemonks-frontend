import http from "./http";
import axios from "axios";
import { filter } from "lodash";
//----------------------------------
export const login = async (payload: any) => {
  const { data } = await http.post(`/auth/login`, payload);
  return data;
};
export const register = async (payload: any) => {
  const { data } = await http.post(`/auth/register`, payload);
  return data;
};
export const getProducts = async (query: any) => {
  query = query || "";
  const { data } = await http.get(`/products${query}`);
  return data;
};
export const getAmcs = async (page: any, search: any) => {
  const { data } = await http.get(`/admin/amcs?search=${search}&page=${page}`);
  return data;
};
export const getAmcsforUser = async (page: any, search: any) => {
  const { data } = await http.get(`/amcsFilter?search=${search}&page=${page}`);
  return data;
};
export const getAllProducts = async () => {
  const { data } = await http.get(`/products/all`);
  return data;
};
export const getNewProducts = async () => {
  const { data } = await http.get(`/products/new`);
  return data;
};

export const getNewArrivels = async () => {
  const { data } = await http.get("/new-arrivals");
  return data;
};
export const getProductDetails = async (id: any) => {
  const { data } = await http.get(`/products/${id}`);
  return data;
};
export const getProductReviews = async (id: any) => {
  const { data } = await http.get(`/reviews/${id}`);
  return data;
};
export const addReview = async (payload: any) => {
  console.log(payload, " this is payload will be send ");
  const { data } = await http.post(`/reviews/${payload.id}`, payload);
  return data;
};
export const getCategories = async () => {
  const { data } = await http.get(`/categories`);
  return data;
};
export const getUserProfile = async (page: any) => {
  const { data: response } = await http.get(`/users/profile${page}`);
  return response;
};
export const getAmcsDetails = async (page: any) => {
  const { data: response } = await http.get(`/users/getAmcsOrder${page}`);
  return response;
};
export const updateAmcs = async (payload: any) => {
  console.log("update Amcs", payload);
  const data = payload;
  const { data: response } = await http.post(`/users/getAmcsOrder`, data);
  return response;
};
export const orderDetails = async ({ ...payload }) => {
  try {
    const { data: response } = await http.post(
      "/users/getDataofOrder",
      payload
    );
    return response;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching order details:", error);
    throw error; // You can throw the error or handle it in some other way
  }
};
export const getUser = async () => {
  const { data } = await http.get(`/users/me`);
  return data;
};
export const updateUser = async ({ id, ...payload }: any) => {
  const { data } = await http.put(`/users/${id}`, payload);
  return data;
};
export const changerPassword = async ({ id, ...payload }: any) => {
  const { data } = await http.put(`/users/change-password/${id}`, payload);
  return data;
};
export const forgetPassword = async (payload: any) => {
  const { data } = await http.post("/auth/forget-password", {
    email: payload,
  });
  return data;
};
export const validOtp = async (payload: any) => {
  console.log(payload, "here the paylaod");
  const { data } = await http.post("/auth/validOtp", payload);
  return data;
};
export const updateUserPass = async (payload: any) => {
  console.log(payload, "here the paylaod");
  const { data } = await http.put("/auth/validOtp", payload);
  return data;
};
export const resetPassword = async ({ newPassword, token }: any) => {
  const { data } = await http.post("/auth/reset-password", {
    newPassword: newPassword,
    token: token,
  });
  return data;
};
export const getAddress = async (id: any) => {
  const { data } = await http.get(`/users/addresses/${id}`);
  return data;
};
export const updateAddress = async ({ id, ...payload }: any) => {
  const { data } = await http.put(`/users/addresses/${id}`, payload);
  return data;
};
export const createAddress = async ({ id, ...payload }: any) => {
  const { data } = await http.post(`/users/addresses/${id}`, payload);
  return data;
};
export const deleteAddress = async ({ id, ...payload }: any) => {
  const { data } = await http.delete(`/users/addresses/${id}`, {
    data: payload,
  });
  return data;
};
export const search = async (payload: any) => {
  const { data } = await http.post(`/products/search`, payload);
  return data;
};
export const getInvoices = async () => {
  const { data } = await http.get(`/users/invoice`);
  return data;
};
// export const placeOrder = async (payload: any) => {
//   console.log(payload);

//   for (let temp of payload.items) {
//     if (temp.priceofAmcs) {
//       console.log(
//         "here i************************************ am ",
//         temp.priceofAmcs
//       );
//       const { data } = await http.post(`/orderAmcs`, payload);
//       return data;
//     } else {
//       console.log(
//         "here i*********************************** am ",
//         temp.priceofAmcs
//       );
//       const { data } = await http.post(`/orders`, payload);
//       return data;
//     }
//   }

// };
// export const placeOrder = async (payload: any) => {
//   console.log(payload);

//   for (let temp of payload.items) {
//     if (temp.priceofAmcs) {
//       console.log(
//         "here i************************************ am ",
//         temp.priceofAmcs
//       );

//       // Create a new payload with only the current item that has priceofAmcs
//       const itemPayload = { ...payload, items: [temp] };

//       const { data } = await http.post(`/orderAmcs`, itemPayload);
//       console.log("Order placed for item with priceofAmcs:", data);
//       // Optionally, you can handle the response for this item
//     } else {
//       // Create a new payload with only the current item that doesn't have priceofAmcs
//       const itemPayload = { ...payload, items: [temp] };

//       const { data } = await http.post(`/orders`, itemPayload);
//       console.log("Order placed for item without priceofAmcs:", data);
//       // Optionally, you can handle the response for this item
//     }
//   }
// };
export const placeOrder = async (payload: any) => {
  let singlePayload = { ...payload, items: [], amcsItems: [] };

  for (let temp of payload.items) {
    if (temp.priceofAmcs) {
      singlePayload.amcsItems.push(temp);
    } else {
      singlePayload.items.push(temp);
    }
  }

  const { data } = await http.post(`/orders`, singlePayload);

  return data;
  // for (let temp of payload.items) {
  //   if (temp.priceofAmcs) {
  //     // console.log("to checking the amcs data ", temp.priceofAmcs);

  //     // Create a new payload with only the current item that has priceofAmcs
  //     const itemPayload = {
  //       ...payload,
  //       amcsItems: [temp],
  //       items: [],
  //     };
  //     console.log(itemPayload, "  checking the payloads here with amcs data ");
  //     // const { data } = await http.post(`/orderAmcs`, itemPayload);
  //     // console.log("Order placed for item with priceofAmcs:", data);
  //     // return data;
  //     // Store the data in the orderResults array
  //     // orderResults.push(data);
  //   } else {
  //     // Create a new payload with only the current item that doesn't have priceofAmcs
  //     const itemPayload = { ...payload, items: [temp] };
  //     console.log(itemPayload, "  checking the payloads here  itemsPayloads ");
  //     //
  //     // console.log("Order placed for item without priceofAmcs:", data);

  //     // Store the data in the orderResults array
  //     // orderResults.push(data);
  //     // return data;
  //   }
};

// Return the array containing all order results
// return orderResults;
// };

export const getLayout = async () => {
  const { data } = await http.get(`/layout`);
  return data;
};
export const singleDeleteFile = async (payload: any) => {
  console.log(payload, "here the payloads");
  const { data } = await http.delete(`/delete`, { data: payload });
  return data;
};
export const getNotification = async (page: any) => {
  const { data } = await http.get(`/notifications?page=${page}`, {});
  return data;
};

export const sendNewsletter = async (payload: any) => {
  const { data } = await http.post(`/newsletter`, payload);
  return data;
};
// export const getSingleOrder = async (payload: any) => {
//   console.log(payload, " here i am to ");
//   const { data } = await http.get(`/orders/${payload}`);
//   const { data1 } = await http.get(`/orderAmcs/${payload}`);
//   return data;
// };
export const getShipping = async () => {
  console.log("here getShipping ");
  try {
    const response = await http.get(`/admin/comman-setting`);

    return response;
  } catch (err) {
    throw err;
  }
};
export const getSingleOrder = async (payload: any) => {
  try {
    // Try fetching data from the first endpoint
    const response = await http.get(`/orders/${payload}`);
    console.log("response from /orders:", response);
    if (response.data.data != null || response.data.data != undefined) {
      return response;
    } else {
      const response2 = await http.get(`/orderAmcs/${payload}`);
      console.log("response from /orderAmcs2:", response2);
      return response2;
    }
  } catch (error) {
    // Handle errors that occurred during the requests
    console.error("Error fetching data:", error);
    throw error; // Optionally, you can rethrow the error or handle it differently
  }
};
export const updateWishlist = async (payload: any) => {
  const { data } = await http.post(`/wishlist`, payload);
  return data;
};

export const getSliders = async () => {
  const { data } = await http.get(`/sliders/primary`);
  return data;
};

export const getWishlist = async () => {
  const { data } = await http.get(`/wishlist`);
  return data;
};

export const getRates = async (currency: any) => {
  // const { data } = await axios.get(
  //   `https://api.exchangerate-api.com/v4/latest/inr`
  // );
  // const unitRate = data.rates[currency.toUpperCase()] || 1;
  const unitRate = 1;
  return unitRate;
};

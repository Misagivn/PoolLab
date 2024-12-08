import ApiManager from "./ApiManager";

export const get_all_product = async (data) => {
  try {
    const response = await ApiManager.get(
      `/Product/GetAllProducts?ProductTypeId=${data.ProductTypeId}&ProductGroupId=${data.ProductGroupId}&Status=${data.Status}`
    );
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      return error.response;
    } else if (error.request) {
      // Request was made but no response received
      console.log("Request error:", error.request);
      return error.request;
    } else {
      // Error occurred while setting up the request
      console.log("Error:", error.message);
      return error;
    }
  }
};

export const get_all_product_type = async () => {
  try {
    const response = await ApiManager.get("/ProductType/GetAllProductTypes");
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      return error.response;
    } else if (error.request) {
      // Request was made but no response received
      console.log("Request error:", error.request);
      return error.request;
    } else {
      // Error occurred while setting up the request
      console.log("Error:", error.message);
      return error;
    }
  }
};

export const get_all_product_group = async () => {
  try {
    const response = await ApiManager.get("/GroupProduct/GetAllGroupProduct");
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      return error.response;
    } else if (error.request) {
      // Request was made but no response received
      console.log("Request error:", error.request);
      return error.request;
    } else {
      // Error occurred while setting up the request
      console.log("Error:", error.message);
      return error;
    }
  }
};
export const add_product_to_order = async (id, data) => {
  try {
    const response = await ApiManager.post(
      `/OrderDetail/AddNewProductToOrder/${id}`,
      data
    );
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      return error.response;
    } else if (error.request) {
      // Request was made but no response received
      console.log("Request error:", error.request);
      return error.request;
    } else {
      // Error occurred while setting up the request
      console.log("Error:", error.message);
      return error;
    }
  }
};

export const get_user_order_product = async (data) => {
  try {
    const response = await ApiManager.get(
      `/orderdetail/getallorderdetailbytableid/${data.id}`
    );
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      return error.response;
    } else if (error.request) {
      // Request was made but no response received
      console.log("Request error:", error.request);
      return error.request;
    } else {
      // Error occurred while setting up the request
      console.log("Error:", error.message);
      return error;
    }
  }
};

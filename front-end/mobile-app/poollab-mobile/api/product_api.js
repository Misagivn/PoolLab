import ApiManager from "./ApiManager";
import { getStoredTableInfo } from "./tokenDecode";

export const get_all_product = async (data) => {
  const tableData = await getStoredTableInfo();
  storeId = tableData.bidaTable.storeId;
  console.log("tableData: ", tableData);
  console.log("data: ", data);
  console.log("store id: ", tableData.bidaTable.storeId);
  const status = "Còn Hàng";
  try {
    console.log("data: ", data);
    console.log("storeId: ", storeId);
    console.log("status: ", status);
    const response = await ApiManager.get(
      `/Product/GetAllProducts?ProductTypeId=${data.ProductTypeId}&ProductGroupId=${data.ProductGroupId}&Status=${data.Status}&StoreId=${storeId}`
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

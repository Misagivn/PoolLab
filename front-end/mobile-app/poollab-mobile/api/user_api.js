import ApiManager from "./ApiManager";

export const user_login = async (data) => {
  try {
    const response = await ApiManager.post("/Auth/Login", data);
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

export const register_user = async (data) => {
  try {
    const response = await ApiManager.post("/Auth/Register", data);
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

export const get_user_details = async (userId) => {
  try {
    const response = await ApiManager.get(`/Account/GetAccountByID/${userId}`);
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

export const update_user = async (data, userId) => {
  try {
    const response = await ApiManager.put(
      `/Account/UpdateInfoUser/${userId}`,
      data
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.log("error response:", error.response);
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
export const update_user_avatar = async (image) => {
  try {
    const response = await ApiManager.uploadFile(
      `https://poollabwebapi20241008201316.azurewebsites.net/api/Account/UploadFileAvatar`,
      image //base64Image },
    );
    return response;
  } catch (error) {
    console.error(
      "Avatar upload error:",
      error.response?.data,
      " error response:",
      error.message
    );
    throw error;
  }
};

export const add_balance = async (userId, data) => {
  try {
    const response = await ApiManager.put(
      `/Account/depositbalance/${userId}`,
      data
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.log("error response:", error.response);
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

export const wallet_manage = async (userId, data) => {
  console.log("api do run");
  try {
    const response = await ApiManager.get(
      `/transaction/getalltransaction?TypeCode=${data}&AccountId=${userId}&PageSize=30&SortBy=paymentDate&SortAscending=false`
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

export const add_balance_vnpay = async (data) => {
  try {
    const response = await ApiManager.post(`/vnpay/createpayment/`, data);
    return response;
  } catch (error) {
    if (error.response) {
      console.log("error response:", error.response);
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

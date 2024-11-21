
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

export const update_user = async (data, userId, token) => {
  try {
    const response = await ApiManager.put(
      `/Account/UpdateInfoUser/${userId}`, 
      data, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
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
      image, //base64Image },
    );
    return response;
  } catch (error) {
    console.error('Avatar upload error:', error.response?.data, " error response:", error.message);
    throw error;
  }
};
import ApiManager from "./ApiManager";

export const create_booking = async (data) => {
  try {
    console.log("Co chay: ", data);
    const response = await ApiManager.post("/Booking/CreateNewBooking", data);
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

export const get_user_booking = async (data) => {
  try {
    console.log("---------------------------------------------");
    console.log("Co chay: ", data);
    const response = await ApiManager.get(
      `Booking/GetAllBooking?CustomerId=${data.CustomerId}&BilliardTypeId=${data.billiardTypeId}&StoreId=${data.storeId}&AreaId=${data.areaId}&Status=${data.status}&SortBy=${data.SortBy}&SortAscending=${data.SortAscending}&PageSize=50&PageNumber=${data.PageNumber}`
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

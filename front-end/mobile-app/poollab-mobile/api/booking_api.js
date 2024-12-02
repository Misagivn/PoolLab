import ApiManager from "./ApiManager";

export const create_booking = async (data) => {
  try {
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
    const response = await ApiManager.get(
      `/Booking/GetAllBooking?CustomerId=${data.CustomerId}&BilliardTypeId=${data.billiardTypeId}&StoreId=${data.storeId}&AreaId=${data.areaId}&Status=${data.status}&SortBy=${data.SortBy}&SortAscending=${data.SortAscending}&PageSize=50&PageNumber=${data.PageNumber}&IsRecurring=false`
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
export const get_user_booking_recurring = async (data) => {
  try {
    const response = await ApiManager.get(
      `/Booking/GetAllBooking?CustomerId=${data.CustomerId}&BilliardTypeId=${data.billiardTypeId}&StoreId=${data.storeId}&AreaId=${data.areaId}&Status=${data.status}&SortBy=${data.SortBy}&SortAscending=${data.SortAscending}&PageSize=50&PageNumber=${data.PageNumber}&IsRecurring=true`
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

export const get_all_booking = async (data) => {
  try {
    const response = await ApiManager.get(
      `/booking/getallbooking?CustomerId=${data.id}&Status=${data.status}&PageNumber=1&PageSize=99&SortBy=createdDate&SortAscending=true`
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

export const cancel_booking = async (data) => {
  try {
    console.log("---------------------------------------------");
    console.log("Co chay delete: ", data);
    const requestBody = {
      answer: data.cancelAnswer,
    };
    const response = await ApiManager.put(
      `Booking/CancelBooking/${data.bookingId}`,
      requestBody
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

export const create_recurring_booking = async (data) => {
  try {
    const response = await ApiManager.post(
      "/Booking/createrecurringbooking",
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

export const cancel_booking_recurring = async (data) => {
  try {
    console.log("---------------------------------------------");
    console.log("Co chay delete: ", data);
    const requestBody = {
      answer: data.cancelAnswer,
    };
    const response = await ApiManager.put(
      `Booking/CancelBooking/${data.bookingId}`,
      requestBody
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

export const get_user_booking_recurring_by_id = async (id) => {
  try {
    const response = await ApiManager.get(
      `/booking/getbookingrecurringbyid/${id}`
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

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
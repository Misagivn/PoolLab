import ApiManager from "./ApiManager";

export const get_all_event = async () => {
  try {
    const response = await ApiManager.get(
      `/event/getallevent?PageNumber=1&PageSize=20&SortBy=createdDate&SortAscending=false`
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

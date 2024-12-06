import ApiManager from "./ApiManager";

export const get_courses = async (data) => {
  try {
    const response = await ApiManager.get(
      `/course/getallcourses?StoreId=${data.storeId}&SortBy=createdDate&SortAscending=true&Status=${data.status}`
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

export const register_course = async (data) => {
  try {
    const response = await ApiManager.post(
      `/registeredcourse/createregisteredcourse`,
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

export const get_course_enroll = async (data) => {
  try {
    const response = await ApiManager.get(
      `/registeredcourse/getallregisteredcourses?StudentId=${data.userId}&IsEnroll=true&SortBy=createdDate&SortAscending=false&StoreId=${data.storeId}&Status=${data.status}`
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

export const cancel_courses = async (data) => {
  try {
    const response = await ApiManager.put(
      `/registeredcourse/cancelregisteredcourse/${data}`
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

export const get_course_enroll_by_id = async (data) => {
  try {
    const response = await ApiManager.get(
      `/registeredcourse/getallregisteredcourses?StudentId=${data.id}&IsEnroll=false&SortBy=createdDate&SortAscending=false&Status=${data.status}`
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

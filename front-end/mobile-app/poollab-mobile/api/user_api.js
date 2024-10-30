import ApiManager from "./ApiManager";

// const loginData = {
//   email: "nhat@gmail.com",
//   password: "12345",
// };
export const user_login = async (data) => {
  try {
    const response = await ApiManager.post("/Auth/Login", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const check_email_availability = async (data) => {
  try {
    const response = await ApiManager.post("/Auth/CheckEmailAvailability", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const register_user = async (data) => {
  try {
    const response = await ApiManager.post("/Auth/Register", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
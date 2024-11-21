import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token } = response.data.data;

    // Decode token to get user info
    const decodedToken = jwt_decode(token);

    // Save token and user info to AsyncStorage
    await AsyncStorage.multiSet([
      ["userToken", JSON.stringify(token)],
      ["userData", JSON.stringify(decodedToken)],
    ]);

    return {
      success: true,
      user: decodedToken,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.multiRemove(["userToken", "userData"]);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

export const getStoredToken = async () => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    return userToken ? JSON.parse(userToken) : null;
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
};

export const getStoredUser = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting stored user:", error);
    return null;
  }
};

export const getStoredTableData = async () => {
  try {
    const tableData = await AsyncStorage.getItem("tableData");
    return tableData ? JSON.parse(tableData) : null;
  } catch (error) {
    console.error("Error getting stored table data:", error);
    return null;
  }
};

export const getStoredTableInfo = async () => {
  try {
    const tableInfo = await AsyncStorage.getItem("tableInfo");
    return tableInfo ? JSON.parse(tableInfo) : null;
  } catch (error) {
    console.error("Error getting stored table info:", error);
    return null;
  }
};

// Example of using the token for other API calls
export const fetchProtectedData = async () => {
  try {
    const response = await api.get("/protected-route");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_user_playtime = async () => {
  try {
    const userPlayTime = await AsyncStorage.getItem("userPlayTime");
    return userPlayTime ? JSON.parse(userPlayTime) : null;
  } catch (error) {
    console.error("Error getting user play time:", error);
    return null;
  }
};

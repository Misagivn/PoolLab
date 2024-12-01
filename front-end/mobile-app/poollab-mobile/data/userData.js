import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getStoredUser } from "../api/tokenDecode";
import { get_user_details } from "../api/user_api";
export const getAccountId = async () => {
  try {
    const accountData = await getStoredUser();
    if (accountData) {
      const accountId = accountData.AccountId;
      return accountId;
    }
  } catch (error) {
    console.error("Error getting account ID:", error);
  }
};

export const getUserName = async () => {
  try {
    const accountData = await getStoredUser();
    if (accountData) {
      const accountName = accountData.Username;
      return accountName;
    }
  } catch (error) {
    console.error("Error getting user name:", error);
  }
};

export const getUserFullName = async (userId) => {
  try {
    if (userId) {
      const response = await get_user_details(userId);
      if (response.data.status === 200) {
        const userFullName = response.data.data.fullName;
        return userFullName;
      }
    }
  } catch (error) {
    console.error("Error getting user balance:", error);
  }
};

export const getUserEmail = async (userId) => {
  try {
    if (userId) {
      const response = await get_user_details(userId);
      if (response.data.status === 200) {
        const userEmail = response.data.data.email;
        return userEmail;
      }
    }
  } catch (error) {
    console.error("Error getting user balance:", error);
  }
};

export const getUserBalance = async (userId) => {
  try {
    if (userId) {
      const response = await get_user_details(userId);
      if (response.data.status === 200) {
        const userBalance = response.data.data.balance;
        return userBalance;
      }
    }
  } catch (error) {
    console.error("Error getting user balance:", error);
  }
};

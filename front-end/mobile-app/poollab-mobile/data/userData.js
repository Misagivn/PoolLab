import { useState, useEffect } from "react";
import { getStoredUser } from "@/api/tokenDecode";
import { get_user_details } from "@/api/user_api";

export const userData = () => {
    const [userFullName1, setUserFullName] = useState("");
    const [userEmail1, setUserEmail] = useState("");
    useEffect(() => {
      const loadStat = async () => {
        try {
          const storedUser = await getStoredUser();
          if (storedUser) {
            get_user_details(storedUser.AccountId).then((response) => {
              if (response.data.status === 200) {
                const userFullName = response.data.data.fullName;
                const userEmail = response.data.data.email;
                setUserFullName(userFullName);
                setUserEmail(userEmail);
              }
            });
          }
        } catch (error) {
          console.error("Error loading stored user:", error);
        }
      };
      loadStat();
    }, []);
    return {
      userFullName1,
      userEmail1,
    };
};